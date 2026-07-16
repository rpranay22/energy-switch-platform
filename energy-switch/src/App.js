import { useState } from "react";
import AdPage from "./AdPage";
import Chatbot from "./Chatbot";
import FaqWidget from "./FaqWidget";
import FormPage from "./FormPage";
import SuccessPage from "./SuccessPage";
import "./styles.css";

function App() {
  const [currentPage, setCurrentPage] =
    useState("ad");

  const [
    submittedCustomer,
    setSubmittedCustomer,
  ] = useState(null);

  const openFormPage = () => {
    setCurrentPage("form");
  };

  const handleSuccessfulSubmission = (
    customerData
  ) => {
    setSubmittedCustomer(customerData);
    setCurrentPage("success");
  };

  const returnToHome = () => {
    setSubmittedCustomer(null);
    setCurrentPage("ad");
  };

  return (
    <div>
      {currentPage === "ad" && (
        <AdPage onSwitch={openFormPage} />
      )}

      {currentPage === "form" && (
        <FormPage
          onSuccess={
            handleSuccessfulSubmission
          }
        />
      )}

      {currentPage === "success" &&
        submittedCustomer && (
          <SuccessPage
            customer={submittedCustomer}
            onBackHome={returnToHome}
          />
        )}

      <Chatbot />
      <FaqWidget />
    </div>
  );
}

export default App;