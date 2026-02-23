import { useEffect, useState } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import api from "../utils/baseUrlApi";
import ProductCard from "../components/ProductCard";
import Hero from "./Hero";
// =============== HOME PAGE, HERE WE CAN ADD HERO, FEATURE, CATEGORY AND OTHER SECTIONS =======
const Home = () => {
  return (
    <Box>
      <Hero />
    </Box>
  );
};
export default Home;