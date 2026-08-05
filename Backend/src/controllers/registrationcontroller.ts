import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../db";

export const addUser = async (req: Request, res: Response) => {

      console.log("Request Body:", req.body);
  try {
    const {
      username,
      email,
      password,
      full_name,
      phone_number,
    } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
      (
        username,
        email,
        password_hash,
        full_name,
        phone_number,
        role_id,
        is_active,
        is_verified
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id, username, email`,
      [
        username,
        email,
        passwordHash,
        full_name,
        phone_number,
        2,      // Default USER role
        true,
        false,
      ]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};