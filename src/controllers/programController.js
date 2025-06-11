// src\controllers\programController.js
import { ProgramModel } from '../models/programModel.js';

export const getAllPrograms = async (req, res) => {
  try {
    const result = await ProgramModel.getAll();
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
};

export const getProgramById = async (req, res) => {
  try {
    const result = await ProgramModel.getById(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Program not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch program' });
  }
};

export const createProgram = async (req, res) => {
  try {
    const result = await ProgramModel.create(req.body);
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create program' });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const result = await ProgramModel.update(req.params.id, req.body);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Program not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update program' });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const result = await ProgramModel.delete(req.params.id);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Program not found' });
    res.json({ message: 'Program deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete program' });
  }
};
