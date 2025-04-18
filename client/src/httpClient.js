import axios from "axios";

export default axios.create({
    withCredentials: true,
    baseURL: "https://me-manager.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
})