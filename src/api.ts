import axios from "axios";

const url = "http://localhost:4000"

export default class Api {
    static async getVendors() {
        try {
            const response = await axios.get(`${url}/api/vendors`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    };

    static async getVendor(id: string) {
        try {
            const response = await axios.get(`${url}/api/vendors/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    };

    static async createVendor(params: any) {
        try {
            const response = await axios.post(`${url}/api/vendors`, params)
            return response.data
        } catch (error) {
            console.log(error)
        }
    };

    static async updateVendor(id: string, params: any) {
        try {
            const response = await axios.put(`${url}/api/vendors/${id}`, params)
            return response.data
        } catch (error) {
            console.log(error)
        }
    };

    static async deleteVendor(id: string) {
        try {
            const response = await axios.delete(`${url}/api/vendors/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    };

    static async getUsers() {
        try {
            const response = await axios.get(`${url}/api/users`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    };

    static async getUser(id: string) {
        try {
            const response = await axios.get(`${url}/api/users/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    };

    static async createUser(params: any) {
        try {
            const response = await axios.post(`${url}/api/users`, params)
            return response.data
        } catch (error) {
            console.log(error)
        }
    };

    static async updateUser(id: string, params: any) {
        try {
            const response = await axios.put(`${url}/api/users/${id}`, params)
            return response.data
        } catch (error) {
            console.log(error)
        }
    };

    static async deleteUser(id: string) {
        try {
            const response = await axios.delete(`${url}/api/users/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    };
};