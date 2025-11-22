import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Function to handle GET requests
export const get = async (endpoint: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching data: ${error}`);
    }
};

// Function to handle POST requests
export const post = async (endpoint: string, data: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
        return response.data;
    } catch (error) {
        throw new Error(`Error posting data: ${error}`);
    }
};

// Function to handle PUT requests
export const put = async (endpoint: string, data: any) => {
    try {
        const response = await axios.put(`${API_BASE_URL}${endpoint}`, data);
        return response.data;
    } catch (error) {
        throw new Error(`Error updating data: ${error}`);
    }
};

// Function to handle DELETE requests
export const del = async (endpoint: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}${endpoint}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error deleting data: ${error}`);
    }
};