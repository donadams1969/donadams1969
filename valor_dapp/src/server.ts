import express from "express";
import { valoraiplus_createAzreiRouter } from "./valoraiplus_azrei_lock";
import { valoraiplus_createViolationRouter } from "./valoraiplus_violation_auto";

const app = express();

const opts = {
  valoraiplus_module_id: process.env.VALORAIPLUS_MODULE_ID || "valoraiplus_treasury",
  valoraiplus_GILLBTC:   process.env.VALORAIPLUS_GILLBTC   || "0xG1LLB7C5152",
  namespace:             process.env.VALORAIPLUS_NAMESPACE || "VALORCHAIN-G",
  phbiUrl:               process.env.VALORAIPLUS_PHBI_URL
};

app.use(valoraiplus_createAzreiRouter(opts));      // /valoraiplus/azrei-lock
app.use(valoraiplus_createViolationRouter(opts));  // POST /valoraiplus/aml/ingest

app.listen(process.env.PORT || 5152, () => {
  console.log(`Server listening on port ${process.env.PORT || 5152}`);
});
