CREATE TABLE IF NOT EXISTS Admin (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS Vendor (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code VARCHAR(10),
    contact_info VARCHAR(255),
    overall_rating DECIMAL(2,1),
    feedback TEXT
);
CREATE TABLE IF NOT EXISTS Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS Material (
    material_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    description TEXT,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS Stock (
    stock_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT,
    material_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (vendor_id) REFERENCES Vendor(vendor_id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES Material(material_id) ON DELETE CASCADE
);
