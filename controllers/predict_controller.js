const fetch = require("node-fetch"); // Import fetch
const UserModel = require("../models/user_model"); // Import UserModel
require("dotenv").config(); // Import env variables

const PredictController = {
  // Method predict
  predict: async (req, res) => {
    const { interest } = req.body;
    const userId = req.user.payload.id; // Ambil user ID dari sesi login

    if (!interest) {
      return res.status(400).json({ message: "Interest data is required!" });
    }

    try {
      // Kirim data ke API model
      const response = await fetch(`${process.env.API_MODEL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interest }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction from API");
      }

      const data = await response.json();
      const predictedLabel = data.predicted_label;

      if (!predictedLabel) {
        return res.status(400).json({ message: "Invalid prediction data!" });
      }

      // Mendapatkan deskripsi berdasarkan major yang diprediksi
      UserModel.getMajors(predictedLabel, (err, major) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        const majorId = major.id;

        // Simpan hasil prediksi ke database
        UserModel.savePrediction(
          userId,
          predictedLabel,
          interest,
          majorId,
          (err, result) => {
            if (err) {
              return res.status(500).json({
                message: "Error saving prediction to database",
                error: err.message,
              });
            }
            res.status(200).json({
              message: "Prediction successfully saved!",
              data: {
                userId,
                majors: predictedLabel,
                interest,
                majorId: major.id,
              },
            });
          }
        );
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Prediction failed", error: err.message });
    }
  },
};

module.exports = PredictController;
