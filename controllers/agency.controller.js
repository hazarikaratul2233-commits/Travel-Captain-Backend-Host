import Agency from "../models/agency.model.js";
import { uploadToS3 } from "../config/s3.js";

export const createAgency = async (req, res) => {
  try {
    const agency = await Agency.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Agency created successfully",
      data: agency,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.scan().exec();

    return res.status(200).json({
      success: true,
      count: agencies.length,
      data: agencies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPendingAgencies = async (req, res) => {
  try {
    const agencies = await Agency.scan("status")
      .eq("Pending")
      .exec();

    return res.status(200).json({
      success: true,
      count: agencies.length,
      data: agencies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRequestedAgencies = async (req, res) => {
  try {
    const agencies = await Agency.scan("status")
      .eq("Requested")
      .exec();

    return res.status(200).json({
      success: true,
      count: agencies.length,
      data: agencies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getApprovedAgencies = async (req, res) => {
  try {
    const agencies = await Agency.scan("status")
      .eq("Confirmed")
      .exec();

    return res.status(200).json({
      success: true,
      count: agencies.length,
      data: agencies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const requestAgency = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.files?.pan || !req.files?.adharFront || !req.files?.adharBack) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    let panUrl = null;
    let adharFrontUrl = null;
    let adharBackUrl = null;

    // Upload PAN
    if (req.files?.pan) {
      panUrl = await uploadToS3(
        req.files.pan[0],
        `agenctDocuments/${id}/pan/`
      );
    }

    // Upload Aadhar Front
    if (req.files?.adharFront) {
      adharFrontUrl = await uploadToS3(
        req.files.adharFront[0],
        `agenctDocuments/${id}/adharFront/`
      );
    }

    // Upload Aadhar Back
    if (req.files?.adharBack) {
      adharBackUrl = await uploadToS3(
        req.files.adharBack[0],
        `agenctDocuments/${id}/adharBack/`
      );
    }

    const updatedAgency = await Agency.update(
      { _id: req.params.id },
      {
        panUrl: panUrl,
        adharFrontUrl: adharFrontUrl,
        adharBackUrl: adharBackUrl,
        status: "Requested"
      }
    );

    return res.status(200).json({
      success: true,
      message: "Agency updated successfully",
      data: updatedAgency,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAgencyById = async (req, res) => {
  try {
    const agency = await Agency.get(req.params.id);

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: "Agency not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: agency,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAgency = async (req, res) => {
  try {
    const updatedAgency = await Agency.update(
      { _id: req.params.id },
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Agency updated successfully",
      data: updatedAgency,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteAgency = async (req, res) => {
  try {
    await Agency.delete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Agency deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
