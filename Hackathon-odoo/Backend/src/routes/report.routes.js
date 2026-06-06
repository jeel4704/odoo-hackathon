const router = require("express").Router();
const auth = require("../middlewere/auth.middleware");
const role = require("../middlewere/role.middleware");
const db = require("../config/db");

router.get("/summary", auth, (req, res) => {
  if (req.user.role === "vendor") {
    // Fetch statistics scoped to this vendor
    db.query("SELECT id FROM vendors WHERE user_id = ?", [req.user.id], (vErr, vendorResults) => {
      if (vErr || !vendorResults || vendorResults.length === 0) {
        return res.status(404).send("Vendor profile record not found");
      }
      const vendorId = vendorResults[0].id;

      const monthlyQuery = `
        SELECT DATE_FORMAT(created_at, '%b') as month, SUM(total_amount) as value 
        FROM purchase_orders 
        WHERE vendor_id = ?
        GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%b') 
        ORDER BY MONTH(created_at)
      `;

      const statsQuery = `
        SELECT 
          (SELECT COUNT(*) FROM rfq_vendors WHERE vendor_id = ?) as totalVendors,
          (SELECT COUNT(*) FROM rfq_vendors rv JOIN rfqs r ON rv.rfq_id = r.id WHERE rv.vendor_id = ? AND r.status = 'Open') as activeRFQs,
          (SELECT COUNT(*) FROM quotations WHERE vendor_id = ? AND status = 'Submitted') as pendingApprovals,
          (SELECT COUNT(*) FROM purchase_orders WHERE vendor_id = ?) as totalPOs
      `;

      db.query(monthlyQuery, [vendorId], (mErr, monthlyTrends) => {
        if (mErr) return res.status(500).send(mErr.message);

        db.query(statsQuery, [vendorId, vendorId, vendorId, vendorId], (sErr, statsResults) => {
          const stats = sErr ? { totalVendors: 0, activeRFQs: 0, pendingApprovals: 0, totalPOs: 0 } : statsResults[0];

          res.json({
            monthlyTrends: monthlyTrends.length > 0 ? monthlyTrends : [{ month: "No Data", value: 0 }],
            categorySpend: [{ name: "Your Category", value: 1 }],
            performance: [],
            stats
          });
        });
      });
    });
  } else {
    // Monthly Trends
    const monthlyQuery = `
      SELECT DATE_FORMAT(created_at, '%b') as month, SUM(total_amount) as value 
      FROM purchase_orders 
      GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%b') 
      ORDER BY MONTH(created_at)
    `;

    // Spending by Vendor Category
    const categoryQuery = `
      SELECT v.category as name, SUM(po.total_amount) as value 
      FROM purchase_orders po 
      JOIN vendors v ON po.vendor_id = v.id 
      GROUP BY v.category
    `;

    // Vendor Performance
    const performanceQuery = `
      SELECT v.name, COUNT(DISTINCT q.id) as bids, COUNT(DISTINCT po.id) as wins 
      FROM vendors v 
      LEFT JOIN quotations q ON v.id = q.vendor_id 
      LEFT JOIN purchase_orders po ON v.id = po.vendor_id 
      GROUP BY v.id, v.name
    `;

    db.query(monthlyQuery, (mErr, monthlyTrends) => {
      if (mErr) return res.status(500).send(mErr.message);

      db.query(categoryQuery, (cErr, categorySpend) => {
        if (cErr) return res.status(500).send(cErr.message);

        db.query(performanceQuery, (pErr, performance) => {
          if (pErr) return res.status(500).send(pErr.message);

          // Standard stats counts for dashboard
          const statsQuery = `
            SELECT 
              (SELECT COUNT(*) FROM vendors) as totalVendors,
              (SELECT COUNT(*) FROM rfqs WHERE status = 'Open') as activeRFQs,
              (SELECT COUNT(*) FROM quotations WHERE status = 'Submitted') as pendingApprovals,
              (SELECT COUNT(*) FROM purchase_orders) as totalPOs
          `;

          db.query(statsQuery, (sErr, statsResults) => {
            const stats = sErr ? { totalVendors: 0, activeRFQs: 0, pendingApprovals: 0, totalPOs: 0 } : statsResults[0];

            res.json({
              monthlyTrends: monthlyTrends.length > 0 ? monthlyTrends : [{ month: "No Data", value: 0 }],
              categorySpend: categorySpend.length > 0 ? categorySpend : [{ name: "No Data", value: 0 }],
              performance: performance.length > 0 ? performance : [{ name: "No Data", bids: 0, wins: 0 }],
              stats
            });
          });
        });
      });
    });
  }
});

module.exports = router;
