import jwt from 'jsonwebtoken';

const authJWT = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" }); 
    }

    // Expect format: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); //   use env var
    req.user = decoded; // optional: store decoded payload
    next();

  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token", error: error.message });
  }
};

export default authJWT;


// --- IGNORE ---

// const authJWT = (req, res, next) => {
//   try {
//     const token = req.header("Authorization").replace("Bearer ", "");
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next(); 
//   } catch (error) {
//     res.status(401).send({ error: "Please authenticate." });
//   }   
// };

// export default authJWT;