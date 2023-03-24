import express from "express";

let configViewEngine = (app) => {
    app.use(express.static("./src/public")); // cài đặt thư mục cho client có thể có dc tài nguyên gì 
    app.set("view engine", "ejs"); // set view engine với công nghệ ejs
    app.set("views", "./src/views")
}

module.exports = configViewEngine;