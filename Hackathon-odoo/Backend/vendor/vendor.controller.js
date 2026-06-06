const Vendor = require("./vendor.model");
const activityService = require("../src/services/activity.service");

exports.createVendor = (req, res) => {
  const { name, category, gst_number, contact_person, email, phone, status, password } = req.body;

  if (!name || !category || !gst_number || !contact_person || !email || !phone) {
    return res.status(400).send("Required vendor fields are missing");
  }

  Vendor.create({ name, category, gst_number, contact_person, email, phone, status, password }, (err, vendor) => {
    if (err) {
      return res.status(500).send("Failed to create vendor: " + err.message);
    }
    
    activityService.logActivity(
      req.user ? req.user.id : null,
      "Create Vendor",
      `Vendor ${name} (${email}) created successfully`
    );

    res.status(201).json(vendor);
  });
};

exports.getAllVendors = (req, res) => {
  const { search, category, status } = req.query;

  Vendor.getAll({ search, category, status }, (err, vendors) => {
    if (err) {
      return res.status(500).send("Failed to fetch vendors: " + err.message);
    }
    res.json(vendors);
  });
};

exports.getVendorById = (req, res) => {
  Vendor.getById(req.params.id, (err, vendor) => {
    if (err) {
      return res.status(500).send("Error retrieving vendor: " + err.message);
    }
    if (!vendor) {
      return res.status(404).send("Vendor not found");
    }
    res.json(vendor);
  });
};

exports.getVendorProfile = (req, res) => {
  Vendor.getByUserId(req.user.id, (err, vendor) => {
    if (err) {
      return res.status(500).send("Error retrieving vendor profile: " + err.message);
    }
    if (!vendor) {
      return res.status(404).send("Vendor profile not found for this user account");
    }
    res.json(vendor);
  });
};

exports.updateVendor = (req, res) => {
  const { name, category, gst_number, contact_person, email, phone, status } = req.body;
  const id = req.params.id;

  if (!name || !category || !gst_number || !contact_person || !email || !phone || !status) {
    return res.status(400).send("All fields are required to update vendor details");
  }

  Vendor.update(id, { name, category, gst_number, contact_person, email, phone, status }, (err, result) => {
    if (err) {
      return res.status(500).send("Failed to update vendor: " + err.message);
    }
    
    activityService.logActivity(
      req.user.id,
      "Update Vendor",
      `Vendor ${name} (ID: ${id}) updated`
    );

    res.send("Vendor updated successfully");
  });
};

exports.deleteVendor = (req, res) => {
  const id = req.params.id;

  Vendor.delete(id, (err, result) => {
    if (err) {
      return res.status(500).send("Failed to delete vendor: " + err.message);
    }

    activityService.logActivity(
      req.user.id,
      "Delete Vendor",
      `Vendor ID ${id} deleted`
    );

    res.send("Vendor deleted successfully");
  });
};
