import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Add timestamp
    const record = {
      ...data,
      timestamp: new Date().toISOString()
    };
    
    // Define the path for the JSON file in the project root
    const filePath = path.join(process.cwd(), 'pre-orders.json');
    
    let preOrders = [];
    
    try {
      // Check if file exists and read it
      const fileContent = await fs.readFile(filePath, 'utf-8');
      if (fileContent) {
        preOrders = JSON.parse(fileContent);
      }
    } catch (error) {
      // File doesn't exist yet, we'll create a new array
      console.log('Creating new pre-orders file.');
    }
    
    // Append new record
    preOrders.push(record);
    
    // Write back to file nicely formatted
    await fs.writeFile(filePath, JSON.stringify(preOrders, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, message: 'Pre-order saved successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error saving pre-order:', error);
    return NextResponse.json({ success: false, message: 'Failed to save pre-order.' }, { status: 500 });
  }
}
