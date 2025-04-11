import axios from 'axios';
import { Fight, Fighter } from '../types/data';

// Using environment variables for API configuration
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.ufc.com/v1';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Simple error handler for API calls
const handleError = (error: any) => {
  if (error.response) {
    console.error('API Error:', error.response.status, error.response.data);
    throw new Error(error.response.data.message || 'API request failed');
  }
  throw error;
};

// Get fight details for a specific event
export const getFightDetails = async (eventId: string): Promise<Fight> => {
  try {
    // TODO: Replace with actual UFC API endpoint when available
    // For now, using mock data for UFC 302
    return {
      id: 'ufc302-main',
      eventId: eventId,
      fighter1Id: 'islam-makhachev',
      fighter2Id: 'dustin-poirier',
      weightClass: 'Lightweight',
      isTitleFight: true,
      rounds: 5,
      odds: {
        fighter1: '-300',
        fighter2: '+250'
      },
      status: 'upcoming',
      winner: null,
      method: null,
      time: null
    };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Get detailed fighter information
export const getFighterDetails = async (fighterId: string): Promise<Fighter> => {
  try {
    // TODO: Replace with actual UFC API endpoint when available
    // Mock data for Islam Makhachev
    if (fighterId === 'islam-makhachev') {
      return {
        id: 'islam-makhachev',
        name: 'Islam Makhachev',
        record: '25-1-0',
        height: '5\'10"',
        weight: 155,
        reach: '70"',
        stance: 'Orthodox',
        lastThreeFights: [
          'W - Alexander Volkanovski (Decision)',
          'W - Charles Oliveira (Submission)',
          'W - Bobby Green (TKO)'
        ],
        nextThreeFights: [
          'vs Dustin Poirier (2024-06-01)'
        ],
        stats: {
          wins: 25,
          losses: 1,
          draws: 0,
          knockouts: 4,
          submissions: 11,
          decisions: 10,
          strikesLanded: 0,
          strikesAttempted: 0,
          takedownsLanded: 0,
          takedownsAttempted: 0,
          submissionAttempts: 0
        }
      };
    }
    throw new Error('Fighter not found');
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export default {
  getFightDetails,
  getFighterDetails
}; 