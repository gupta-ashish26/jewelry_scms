const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const db = require("./db")
const favicon = require("serve-favicon")
const path = require("path")
const _ = require("lodash")
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')

const app = express()
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Initialize express-session
app.use(session({
    secret: 'Secret',
    resave: false,
    saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
    const query = `SELECT * FROM Admin WHERE username = ? AND password = ?`;
    db.query(query, [username, password], (error, results) => {
        if (error) {
            return done(error);
        }
        if (results.length === 0) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        return done(null, results[0]);
    });
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.username));
passport.deserializeUser((username, done) => {
    db.query('SELECT * FROM Admin WHERE username = ?', [username], (error, results) => {
        if (error) return done(error);
        done(null, results[0]);
    });
});

// Function to check if an admin user exists, and create one if not
async function ensureAdminUser() {
    const queryCheck = `SELECT * FROM Admin WHERE username = 'admin'`;
    const queryInsert = `INSERT INTO Admin (username, password) VALUES ('admin', 'admin')`;

    db.query(queryCheck, (error, results) => {
        if (error) {
            console.error("Error checking for admin user:", error);
            return;
        }

        if (results.length === 0) {
            // No admin user found, so create one
            db.query(queryInsert, (error) => {
                if (error) {
                    console.error("Error creating admin user:", error);
                } else {
                    console.log('Successfully added admin user with default credentials.');
                }
            });
        } else {
            console.log('Admin user already exists.');
        }
    });
}

// Call the ensureAdminUser function after a 1-second delay
setTimeout(() => {
    ensureAdminUser();
}, 1000);


//Endpoints:

app.get("/", function(req, res){
    res.render("home")
})

//Render other pages (about, contact etc)
app.get("/:renderFile", function(req, res){

    const requestFile = _.lowerCase(req.params.renderFile)
    res.render(requestFile)
})

// Test API route to show table names
app.get("/api/test", (req, res) => {
    db.query("select * from Material", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.json(results)
    })
})

// Route to add a new vendor
app.get('/admin/addVendor', ensureAuthenticated, (req, res) => {
    res.render('admin/addVendor');
});

app.post('/admin/addVendor', (req, res) => {
    const { name, city, state, zip_code, contact_info, overall_rating, feedback } = req.body;
    const sql = 'INSERT INTO Vendor (name, city, state, zip_code, contact_info, overall_rating, feedback) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [name, city, state, zip_code, contact_info, overall_rating, feedback], (err) => {
        if (err) {
            console.error("Error adding vendor:", err);
            return res.status(500).send('Error adding vendor.');
        }
        res.redirect('/admin/dashboard');
    });
});

// Route to render add material page with category types
app.get('/admin/addMaterial', ensureAuthenticated, (req, res) => {
    db.query('SELECT * FROM Category', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('admin/addMaterial', { categories: results });
    });
});

app.post('/admin/addMaterial', (req, res) => {
    const { name, type, description, category_id } = req.body;
    const sql = 'INSERT INTO Material (name, type, description, category_id) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [name, type, description, category_id], (err) => {
        if (err) {
            console.error("Error adding material:", err);
            return res.status(500).send('Error adding material.');
        }
        res.redirect('/admin/dashboard');
    });
});

// Route to render add stock page with material list
app.get('/admin/addStock', ensureAuthenticated, (req, res) => {
    db.query('SELECT * FROM Material', (err, results) => {  
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('admin/addStock', { materials: results });
    });
});


app.post('/admin/addStock', (req, res) => {
    const { vendor_id, material_id, quantity, price } = req.body;
    const sql = 'INSERT INTO Stock (vendor_id, material_id, quantity, price) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [vendor_id, material_id, quantity, price], (err) => {
        if (err) {
            console.error("Error adding stock:", err);
            return res.status(500).send('Error adding stock.');
        }
        res.redirect('/admin/dashboard');
    });
});

// Route to edit vendors
app.get('/admin/editVendor', ensureAuthenticated, (req, res) => {
    db.query('SELECT * FROM Vendor', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('admin/editVendor', { vendors: results });
    });
});

app.post('/admin/editV', (req, res) => {
    const { vendor_id,name, city, state, zip_code, contact_info, overall_rating, feedback } = req.body;
    const sql = 'UPDATE Vendor SET name = ?, city = ?, state = ?, zip_code = ?, contact_info = ?, overall_rating = ?, feedback = ? WHERE vendor_id = ?';
    
    db.query(sql, [name, city, state, zip_code, contact_info, overall_rating, feedback, vendor_id], (err) => {
        if (err) {
            console.error("Error updating vendor:", err);
            return res.status(500).send('Error updating vendor.');
        }
        res.redirect('/admin/dashboard');
    });
});

// Route to delete a vendor
app.get('/admin/deleteVendor', ensureAuthenticated, (req, res) => {
    res.render('admin/deleteVendor');
});

app.post('/admin/deleteV', (req, res) => {
    const {vendor_id} = req.body;
    const sql = 'DELETE FROM Vendor WHERE vendor_id = ?';
    
    db.query(sql, [vendor_id], (err) => {
        if (err) {
            console.error("Error deleting vendor:", err);
            return res.status(500).send('Error deleting vendor.');
        }
        res.redirect('/admin/dashboard');
    });
});


// Route to edit materials
app.get('/admin/editMaterial', ensureAuthenticated, (req, res) => {
    db.query('SELECT * FROM Material', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('admin/editMaterial', { materials: results });
    });
});

app.post('/admin/editM', (req, res) => {
    const { material_id, name, type, description, category_id } = req.body;
    const sql = 'UPDATE Material SET name = ?, type = ?, description = ?, category_id = ? WHERE material_id = ?';
    
    db.query(sql, [name, type, description, category_id, material_id], (err) => {
        if (err) {
            console.error("Error updating material:", err);
            return res.status(500).send('Error updating material.');
        }
        res.redirect('/admin/dashboard');
    });
});

// Route to delete a material
app.get('/admin/deleteMaterial', ensureAuthenticated, (req, res) => {
    res.render('admin/deleteMaterial');
});

// Route to handle  deletion by material_id and vendor_id
app.post('/admin/deleteM', (req, res) => {
    const { material_id } = req.body;
    const sql = 'DELETE FROM Material WHERE material_id = ?';
    
    db.query(sql, [material_id], (err) => {
        if (err) {
            console.error("Error deleting material:", err);
            return res.status(500).send('Error deleting material.');
        }
        res.redirect('/admin/dashboard');
    });
});

// Route to edit stock
app.get('/admin/editStock', ensureAuthenticated, (req, res) => {
    db.query('SELECT * FROM Stock', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('admin/editStock', { stocks: results });
    });
});


app.post('/admin/editS', (req, res) => {
    const { material_id, vendor_id, quantity, price } = req.body;
    const sql = 'UPDATE Stock SET quantity = ?, price = ? WHERE material_id = ? AND vendor_id = ?';
    
    db.query(sql, [quantity, price, material_id, vendor_id], (err) => {
        if (err) {
            console.error("Error updating stock:", err);
            return res.status(500).send('Error updating stock.');
        }
        res.redirect('/admin/dashboard');
    });
});

// Route to delete stock

app.get('/admin/deleteStock', ensureAuthenticated, (req, res) => {
    res.render('admin/deleteStock');
});

app.post('/admin/deleteS', (req, res) => {
    const { material_id, vendor_id } = req.body;
    const sql = 'DELETE FROM Stock WHERE material_id = ? AND vendor_id = ?';

    db.query(sql, [material_id, vendor_id], (err) => {
        if (err) {
            console.error("Error deleting stock:", err);
            return res.status(500).send('Error deleting stock.');
        }
        res.redirect('/admin/dashboard');
    });
});

// // Routes for Search and Filtering

// Route for rendering vendors search page with results
app.get('/search/vendors', (req, res) => {
    const { name, city, state, rating } = req.query;
    let query = `SELECT * FROM Vendor WHERE 1=1`;

    if (name) query += ` AND name LIKE '%${name}%'`;
    if (city) query += ` AND city = '${city}'`;
    if (state) query += ` AND state = '${state}'`;
    if (rating) query += ` AND overall_rating >= ${rating}`;

    db.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.render('search/vendors', { vendors: results });
        }
    });
});

// Route for rendering materials search page with results
app.get('/search/materials', (req, res) => {
    const { name, type, category_id } = req.query;

    let query = `
        SELECT Material.material_id, Material.name AS material_name, Material.type, Material.category_id,
               Vendor.vendor_id, Vendor.name AS vendor_name, Vendor.city, Vendor.state, Vendor.zip_code,
               Vendor.contact_info, Vendor.overall_rating, Vendor.feedback,
               Stock.quantity AS stock_quantity, Stock.price AS stock_price
        FROM Material
        LEFT JOIN Stock ON Material.material_id = Stock.material_id
        LEFT JOIN Vendor ON Stock.vendor_id = Vendor.vendor_id
        WHERE 1=1
    `;

    if (name) query += ` AND Material.name LIKE '%${name}%'`;
    if (type) query += ` AND Material.type = '${type}'`;
    if (category_id) query += ` AND Material.category_id = ${category_id}`;

    db.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.render('search/materials', { materials: results });
        }
    });
});


// Admin Routes:
// Route to render the login page
app.get('/login', (req, res) => {
    res.render('login'); // Assuming you have a login.ejs
});

// Route to handle login form submission
app.post('/login', passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/login',
}));

// // Protected route for the admin dashboard
// app.get('/admin/dashboard', (req, res) => {
//     if (req.isAuthenticated()) {
//         res.render('admin/dashboard'); // Admin dashboard page
//     } else {
//         res.redirect('/login');
//     }
// });

// Route for logout
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout Error:', err);
            return res.redirect('/admin/dashboard'); // Fallback in case of error
        }
        res.render('logout'); // Render the dummy logout view to redirect
    });
});



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/admin/dashboard', ensureAuthenticated, (req, res) => {
    res.render('admin/dashboard', { admin: req.user });
});



app.listen(3000, function() {
    console.log("Server is running at port 3000")
})
