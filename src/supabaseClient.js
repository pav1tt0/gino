import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseSchema = import.meta.env.VITE_SUPABASE_SCHEMA || 'public';
const supabaseTable = import.meta.env.VITE_SUPABASE_TABLE || 'materials';

export const supabaseConfigOk = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = supabaseConfigOk ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Map Supabase column names to App expected format
const mapSupabaseToAppFormat = (supabaseData) => {
  return supabaseData.map(item => ({
    // Core identification
    'Material ID': item.material_id || '',
    'Material Name': item.material_name || '',
    'Category': item.category || '',

    // Sustainability metrics
    'Sustainability Rating': item.sustainability_rating || '',
    'Sustainability Score': item.sustainability_score || item.sustainability_rating || '',
    'Environmental_Sustainability': item.environmental_sustainability || '',

    // Environmental impact
    'GHG Emissions (kg CO2e/kg)': item.ghg_emissions || '',
    'Water Consumption (L/kg)': item.water_consumption || '',
    'Energy Use (MJ/kg)': item.energy_use || '',
    'Fuel Consumption (MJ/kg)': item.fuel_consumption || '',
    'Land Use': item.land_use || '',
    'Chemical Use Level': item.chemical_use_level || '',
    'Toxicity': item.toxicity || '',
    'Biodegradability': item.biodegradability || '',

    // Social and governance
    'Social Sustainability': item.social_sustainability || '',
    'Governance': item.governance || '',

    // Physical properties
    'Durability': item.durability || '',
    'Tensile Strength (MPa)': item.tensile_strength || '',
    'Abrasion Resistance': item.abrasion_resistance || '',
    'Chemical Resistance': item.chemical_resistance || '',
    'Moisture Absorption': item.moisture_absorption || '',
    'Temperature Resistance': item.temperature_resistance || '',
    'Elasticity': item.elasticity || '',
    'Dyeability': item.dyeability || '',
    'Comfort Level': item.comfort_level || '',

    // Economic
    'Cost Range ($/kg)': item.cost_range || '',
    'Cost Volatility': item.cost_volatility || '',

    // Applications and context
    'Primary Applications': item.primary_applications || '',
    'Main Challenges': item.main_challenges || '',
    'Key Opportunities': item.key_opportunities || '',

    // Data sources
    'Data Source 1': item.data_source_1 || '',
    'Data Source 1 Date': item.data_source_1_date || '',
    'Data Source 1 URL': item.data_source_1_url || '',
    'Data Source 2': item.data_source_2 || '',
    'Data Source 2 Date': item.data_source_2_date || '',
    'Data Source 2 URL': item.data_source_2_url || '',
    'Data Source 3': item.data_source_3 || '',
    'Data Source 3 Date': item.data_source_3_date || '',
    'Data Source 3 URL': item.data_source_3_url || ''
  }));
};

// Function to fetch materials from Supabase
export const fetchMaterialsFromSupabase = async (tableName = supabaseTable) => {
  if (!supabaseConfigOk || !supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  try {
    const { data, error } = await supabase
      .schema(supabaseSchema)
      .from(tableName)
      .select('*');

    if (error) {
      console.error('Error fetching from Supabase:', error);
      throw error;
    }

    // Map Supabase data to app format
    const mappedData = mapSupabaseToAppFormat(data || []);
    return mappedData;
  } catch (error) {
    console.error('Supabase fetch error:', error);
    throw error;
  }
};

export const checkInviteCode = async (inviteCode) => {
  const trimmed = String(inviteCode || '').trim();
  if (!trimmed) {
    return false;
  }

  const { data, error } = await supabase.rpc('check_invite_code', {
    code: trimmed
  });

  if (error) {
    console.error('Invite code check failed:', error);
    throw error;
  }

  return data === true;
};
