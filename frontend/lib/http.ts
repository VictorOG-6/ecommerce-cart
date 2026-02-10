'use client'

import axios from "axios"
import { API_URL, APP_URL } from "./constants"

export const $http = axios.create({
    baseURL: API_URL,
    withCredentials: false,
})

$http.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error);
    }
)