import { useState } from "react";
import AdPage from "./AdPage";
import Chatbot from "./Chatbot";
import FaqWidget from "./FaqWidget";
import FormPage from "./FormPage";
import "./styles.css";
import SuccessPage from "./SuccessPage";

function App() {
  const [currentPage, setCurrentPage] = useState("ad");
  const [submittedCustomer, setSubmittedCustomer] = useState(null);

  return (
    <div>
      {currentPage === "ad" && (
        <AdPage onSwitch={() => setCurrentPage("form")} />
      )}

      {currentPage === "form" && (
        <FormPage
          onSuccess={(customerData) => {
            setSubmittedCustomer(customerData);
            setCurrentPage("success");
          }}
        />
      )}

      {currentPage === "success" && (
        <SuccessPage
          customer={submittedCustomer}
          onBackHome={() => {
            setSubmittedCustomer(null);
            setCurrentPage("ad");
          }}
        />
      )}

      <Chatbot />
      <FaqWidget />
    </div>
  );
}

export default App;