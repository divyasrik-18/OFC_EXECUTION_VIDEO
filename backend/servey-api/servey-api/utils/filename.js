import path from 'path';
import { v4 as uuidv4 } from 'uuid';


const cleanDate = (dateRaw) => {
  // 1. Convert to string if it's a Date object
  let str = (typeof dateRaw === 'string') 
    ? dateRaw 
    : new Date(dateRaw).toISOString().slice(0, 10);

  return str
    .trim()                  // Remove spaces from start and end
    .replace(/\//g, '-')     // Replace / with -
    .replace(/\s+/g, '')     // Remove spaces in between
    .replace(/[^a-zA-Z0-9-]/g, ''); // Remove special chars (keep letters, numbers, -)
};

export function folderPath(district='UNK', block='UNK', location_type, slotno='', dateRaw=new Date()) {
  const d = district.toUpperCase().replace(/\s+/g,'_');
  const b = block.toUpperCase().replace(/\s+/g,'_');
  const dt = (typeof dateRaw === 'string') ? cleanDate(dateRaw) : cleanDate(new Date(dateRaw).toISOString().slice(0,10).replace(/-/g,''));
  
  // FIX: Force Forward Slashes (/) for Synology/Web compatibility
  // Do NOT use path.join here
  return `${d}/${b}/${location_type}/${slotno ? slotno : 1}/${dt}`;
}

export function buildFilename({ district, block, date, originalname }) {
  const prefix = district.substring(0,3).toUpperCase() + '_' + block.substring(0,3).toUpperCase();
  const dt = date.replace(/-/g,'');
  const ext = originalname.split('.').pop();
  return `${prefix}_${dt}_${uuidv4().slice(0,8)}.${ext}`;
}