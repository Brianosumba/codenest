const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Kolla om användare redan finns
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "E-post är redan registrerad." });
    }

    //Hasha lösenord
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Skapa ny användare
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Användare registrerad" });
  } catch (err) {
    console.error("Fel vid register", err);
    res.status(500).json({ message: "Serverfel vid registrering" });
  }
};

//LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Hitta användaren
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Fel e-post eller lösenord." });
    }

    //Kolla lösenordet
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Fel e-post eller lösenord." });
    }

    //Skapa JWT-token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //Retunera användardata + token
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverfel vid inloggning." });
  }
};
