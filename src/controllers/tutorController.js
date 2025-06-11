// src\controllers\tutorController.js
import { TutorModel } from '../models/tutorModel.js';

export const getAllTutors = async (req, res) => {
  try {
    const result = await TutorModel.getAll();
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
};

export const getTutorById = async (req, res) => {
  try {
    const result = await TutorModel.getById(req.params.id);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Tutor not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tutor' });
  }
};

export const createTutor = async (req, res) => {
  try {
    const { rows } = await TutorModel.create(req.body);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating tutor:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateTutor = async (req, res) => {
  try {
    const result = await TutorModel.update(req.params.id, req.body);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Tutor not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update tutor' });
  }
};

export const deleteTutor = async (req, res) => {
  try {
    const result = await TutorModel.delete(req.params.id);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Tutor not found' });
    res.json({ message: 'Tutor deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete tutor' });
  }
};
