import axios from "axios";

export default axios.create({
    withCredentials: true,
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
})