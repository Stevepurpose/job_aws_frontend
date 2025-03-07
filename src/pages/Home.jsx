
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import backendUrl from "../Back";
import Company from "../components/Company";
import '../styles/Home.css';

const Home = () => {
  const [companies, setCompanies] = useState([]);
  const [company_name, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [applied, setApplied] = useState(false);
  const [Discussions, setDiscussions] = useState("none");
  const [offer, setOffer] = useState(false);
  const [advert_start, setAdvert] = useState("");
  const [close_date, setClose] = useState("");
  const [loggedOut, setLoggedOut] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  useEffect(() => {
    getCompanies();
  }, []);

  function Logout() {
    localStorage.clear();
    setLoggedOut(true);
  }

  if (loggedOut) {
    return <Navigate to="/signup"/>;
  }

  function handleStartDate(e) {
    setAdvert(e.target.value);
  }

  function handleCloseDate(e) {
    setClose(e.target.value);
  }

  function formatAdvertStart(date) {
    return date ? new Date(date).toISOString() : '';
  }

  function formatCloseDate(date) {
    return date ? new Date(date).toISOString() : '';
  }

  const getCompanies = () => {
    backendUrl
      .get("/api/companies/")
      .then((res) => res.data)
      .then((data) => {
        setCompanies(data);
      })
      .catch((err) => {
        if(err.response){
          //The server responded with a status code outside the 2xx range
          alert(err)
          console.log('Error response:', err.response)
          console.log('Error response headers:', err.response.headers)
        }else if(err.request){
          //The request was made but no response was received
          console.log('Error request:', err.request) 
        }else{
          console.log('Error Messsage:', err.message)
        }
      });
  };
  const deleteCompany = (id) => {
    console.log(`Attempting to delete company with ID: ${id}`); // Debugging line
    backendUrl
      .delete(`/api/companies/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Company deleted!");
          getCompanies();
        } else {
          alert("Failed to delete company.");
        }
      })
      .catch((error) => {
        console.error("Error deleting company:", error); // Debugging line
        alert("Error deleting company.");
      });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    let start_date = formatAdvertStart(advert_start);
    let end_date = formatCloseDate(close_date);
    let companyData = { company_name, role, applied, Discussions, offer, advert_start: start_date };
    if (end_date) {
      companyData.close_date = end_date;
    }

    if (editingCompany) {
      // Update existing company
      backendUrl
        .put(`/api/companies/${editingCompany.id}/`, companyData)
        .then((res) => {
          if (res.status === 200) alert("Company updated!");
          else alert("Failed to update company.");
          getCompanies();
          setEditingCompany(null); // Reset editing state
          clearForm();
        })
        .catch((err) => alert(err));
    } else {
      // Create new company
      backendUrl
        .post("/api/companies/", companyData)
        .then((res) => {
          if (res.status === 201) alert("Company created!");
          else alert("Failed to create company.");
          getCompanies();
          clearForm();
        })
        .catch((err) => alert(err));
    }
  };

  const editCompany = (company) => {
    setCompanyName(company.company_name);
    setRole(company.role);
    setApplied(company.applied);
    setDiscussions(company.Discussions);
    setOffer(company.offer);
    setAdvert(company.advert_start ? company.advert_start.split('T')[0] : "");
    setClose(company.close_date ? company.close_date.split('T')[0] : "");
    setEditingCompany(company);
  };

  const clearForm = () => {
    setCompanyName("");
    setRole("");
    setApplied(false);
    setDiscussions("none");
    setOffer(false);
    setAdvert("");
    setClose("");
  };

  return (
    <div>
      <header className='home-header'>
      <nav className="log-nav"> 

      <button onClick={Logout} className='logout'>Logout</button>
    
    
        <h2>Companies</h2>
        
        </nav>
      </header>
      <div>
        {companies.map((company) => (
          <Company company={company} onDelete={deleteCompany} onEdit={editCompany} key={company.id} />
        ))}
      </div>
      <h2>{editingCompany ? "Edit Company" : "Create a Company"}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="company_name">Company Name:</label>
        <input
          type="text"
          id="company_name"
          name="company_name"
          required
          onChange={(e) => setCompanyName(e.target.value)}
          value={company_name}
        />
        <br />
        <label htmlFor="role">Role:</label>
        <input
          type="text"
          id="role"
          name="role"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <br />
        <label htmlFor="applied">Applied:</label>
        <br />
        <input
          type='checkbox'
          id="applied"
          name="applied"
          checked={applied}
          onChange={(e) => setApplied(e.target.checked)}
        />
        <br />
        <label htmlFor="Discussions">Discussions:</label>
        <br />
        <textarea
          id="Discussions"
          name="Discussions"
          value={Discussions}
          onChange={(e) => setDiscussions(e.target.value)}
        ></textarea>
        <br />
        <label htmlFor="offer">Offer:</label>
        <br />
        <input
          type='checkbox'
          id="offer"
          name="offer"
          checked={offer}
          onChange={(e) => setOffer(e.target.checked)}
        />
        <br />
        <label htmlFor="advert_start">Advert-Date:</label>
        <br />
        <input
          type="date"
          id="advert_start"
          name="advert_start"
          required
          value={advert_start}
          onChange={handleStartDate}
        />
        <br />
        <label htmlFor="close_date">Close-Date:</label>
        <br />
        <input
          type="date"
          id="close_date"
          name="close_date"
          value={close_date}
          onChange={handleCloseDate}
        />
        <br />
        <input type="submit" value={editingCompany ? "Update Company" : "Create Company"}></input>
      </form>
    </div>
  );
}

export default Home;


