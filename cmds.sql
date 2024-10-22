mysql -u root -p
create database jewelry_supply_chain;
use jewelry_supply_chain

-- Create Admin Table
CREATE TABLE Admin (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);

-- Create Vendor Table with Composite Location
CREATE TABLE Vendor (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255),           
    state VARCHAR(255),          
    zip_code VARCHAR(10),        
    contact_info VARCHAR(255),   
    overall_rating DECIMAL(2,1),
    feedback TEXT
);

-- Create Category Table (Optional)
CREATE TABLE Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255)
);

-- Create Material Table
CREATE TABLE Material (
    material_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    description TEXT,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE SET NULL
);

-- Create Stock Table
CREATE TABLE Stock (
    stock_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT,
    material_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (vendor_id) REFERENCES Vendor(vendor_id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES Material(material_id) ON DELETE CASCADE
);

---------------------------------------------------------------------------------

INSERT INTO Vendor (name, city, state, zip_code, contact_info, overall_rating, feedback)
VALUES 
('GoldCraft Jewelers', 'New York', 'NY', '10001', '212-555-1234', 4.5, 'Trusted supplier of gold jewelry materials'),
('SilverWorks', 'Los Angeles', 'CA', '90001', '310-555-5678', 4.7, 'Specializes in high-quality silver materials'),
('Gem Traders', 'Las Vegas', 'NV', '89101', '702-555-2345', 4.2, 'Wide variety of precious gems and stones'),
('Metallics Inc.', 'Houston', 'TX', '77001', '713-555-8765', 3.9, 'Supplier of various base and precious metals'),
('Diamond Distributors', 'Chicago', 'IL', '60601', '312-555-3456', 4.8, 'Exclusive supplier of diamonds'),
('Pearl Paradise', 'Miami', 'FL', '33101', '305-555-7890', 4.6, 'Sells a wide range of pearls'),
('Gold & Silver Mart', 'San Francisco', 'CA', '94101', '415-555-6789', 4.3, 'Supplier of gold and silver in bulk'),
('Ruby Refiners', 'Seattle', 'WA', '98101', '206-555-4567', 4.1, 'Specialists in ruby refining and sales'),
('Sapphire Source', 'Dallas', 'TX', '75201', '214-555-9876', 4.4, 'Known for top-quality sapphires'),
('Precious Metal Co.', 'Phoenix', 'AZ', '85001', '602-555-1234', 4.0, 'Supplies all kinds of precious metals'),
('Emerald Emporium', 'Atlanta', 'GA', '30301', '404-555-6543', 4.9, 'Best emeralds in the market'),
('Platinum Plus', 'Denver', 'CO', '80201', '303-555-4321', 3.8, 'Provides a variety of platinum items'),
('Jewelry Materials Ltd.', 'Boston', 'MA', '02101', '617-555-7654', 4.2, 'Offers various precious metals and gems'),
('Opal Outfitters', 'San Diego', 'CA', '92101', '619-555-3210', 4.5, 'Focuses on opals and rare stones'),
('Gold Traders', 'Philadelphia', 'PA', '19101', '215-555-8765', 4.0, 'Bulk sellers of gold'),
('Silver Source', 'Baltimore', 'MD', '21201', '410-555-2341', 4.6, 'High-quality silver materials supplier'),
('Gem Masters', 'Orlando', 'FL', '32801', '407-555-5432', 4.7, 'Various types of gemstones available'),
('Diamond Dealers', 'Las Vegas', 'NV', '89101', '702-555-6789', 4.9, 'High-end diamond sellers'),
('Metal Mart', 'Austin', 'TX', '73301', '512-555-0987', 3.7, 'Supplies metals for industrial and jewelry use'),
('Crystal Clear', 'Portland', 'OR', '97201', '503-555-8763', 4.1, 'Specializes in clear and colored crystals'),
('Ruby Traders', 'Salt Lake City', 'UT', '84101', '801-555-4329', 4.3, 'Known for rare ruby varieties'),
('Diamond Direct', 'Charlotte', 'NC', '28201', '704-555-5674', 4.4, 'Suppliers of certified diamonds'),
('Silver Stone', 'Minneapolis', 'MN', '55401', '612-555-7650', 4.6, 'Silver and gemstone specialists'),
('Golden Suppliers', 'Detroit', 'MI', '48201', '313-555-9871', 4.2, 'Supplier of fine gold jewelry materials'),
('Opal Oasis', 'Tampa', 'FL', '33601', '813-555-3456', 4.5, 'Exclusive supplier of opals and rare gems');

-------------------------------------------------------------------------------

INSERT INTO Category (category_name)
VALUES 
('Gold'),
('Silver'),
('Gemstones'),
('Diamonds'),
('Pearls');

-------------------------------------------------------------------------------

INSERT INTO Material (name, type, description, category_id)
VALUES 
('24K Gold Bar', 'Gold', 'Pure 24K gold bar used for crafting high-quality jewelry.', 1),
('18K Gold Necklace', 'Gold', 'A necklace made from 18K gold, popular for its durability.', 1),
('Sterling Silver Ring', 'Silver', 'A classic ring made from 925 sterling silver.', 2),
('925 Silver Earrings', 'Silver', 'High-quality earrings made from sterling silver.', 2),
('Emerald Gemstone', 'Gemstone', 'A precious green gemstone known for its clarity and color.', 3),
('Ruby Gemstone', 'Gemstone', 'A red gemstone symbolizing love and passion.', 3),
('Diamond Gemstone', 'Diamond', 'A brilliant-cut diamond used in rings and necklaces.', 4),
('Sapphire Gemstone', 'Gemstone', 'A deep blue gemstone representing wisdom and royalty.', 3),
('Pearl Necklace', 'Pearl', 'A classic pearl necklace made with real freshwater pearls.', 5),
('Black Pearl Earrings', 'Pearl', 'Unique earrings made from rare black pearls.', 5),
('Gold Coin', 'Gold', 'A collectible gold coin used as an investment or in jewelry.', 1),
('Silver Coin', 'Silver', 'A collectible silver coin often used in custom jewelry designs.', 2),
('Diamond Ring', 'Diamond', 'An exquisite diamond ring for engagement or special occasions.', 4),
('Gold Plated Watch', 'Gold', 'A watch with gold plating for a luxurious look.', 1),
('Silver Bracelet', 'Silver', 'A lightweight silver bracelet, perfect for daily wear.', 2),
('Emerald Pendant', 'Gemstone', 'A pendant with a stunning emerald gemstone.', 3),
('Pearl Bracelet', 'Pearl', 'A beautiful bracelet made from freshwater pearls.', 5),
('Silver Cufflinks', 'Silver', 'Elegant silver cufflinks for formal wear.', 2),
('Diamond Earrings', 'Diamond', 'Diamond-studded earrings for a sparkling finish.', 4),
('Gold Anklet', 'Gold', 'A traditional anklet made from 22K gold.', 1),
('Gemstone Brooch', 'Gemstone', 'A decorative brooch made from a combination of gemstones.', 3),
('Gold Chain', 'Gold', 'A long chain made from 18K gold, often used for pendants.', 1),
('Silver Necklace', 'Silver', 'A sleek silver necklace with a modern design.', 2),
('Pearl Ring', 'Pearl', 'A simple ring featuring a single freshwater pearl.', 5),
('Ruby Bracelet', 'Gemstone', 'A bracelet adorned with beautiful red rubies.', 3);

-------------------------------------------------------------------------------

INSERT INTO Stock (vendor_id, material_id, quantity, price)
VALUES 
(1, 1, 50, 5000.00),
(2, 2, 30, 3500.00),
(3, 3, 100, 200.00),
(4, 4, 200, 150.00),
(5, 5, 20, 1200.00),
(6, 6, 25, 3000.00),
(7, 7, 15, 8000.00),
(8, 8, 18, 2500.00),
(9, 9, 40, 700.00),
(10, 10, 30, 1000.00),
(11, 11, 75, 2500.00),
(12, 12, 100, 500.00),
(13, 13, 10, 6000.00),
(14, 14, 50, 2000.00),
(15, 15, 150, 400.00),
(16, 16, 20, 800.00),
(17, 17, 60, 550.00),
(18, 18, 40, 300.00),
(19, 19, 35, 5000.00),
(20, 20, 20, 1000.00),
(1, 21, 10, 1200.00),
(2, 22, 25, 800.00),
(3, 23, 70, 450.00),
(4, 24, 30, 600.00),
(5, 25, 15, 2000.00);

