/// <reference path="../types/express.d.ts" />
import { Request, Response } from "express";
import pool from "../db";


export const getMenus = async (req: Request, res: Response) => {
  try {
    const roleId = req.user.role_id; 

    const result = await pool.query(
      `
      SELECT 
          m.id,
          m.menu_name,
          m.menu_path
      FROM menu_master m
      INNER JOIN role_menus rm
      ON m.id = rm.menu_id
      WHERE rm.role_id = $1
      AND m.is_active = true
      ORDER BY m.id
      `,
      [roleId]
    );

    res.json(result.rows);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Unable to load menus"
    });
  }
};