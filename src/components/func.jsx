import React from "react";
import {useState, useEffect} from "react";


export default function Func (){

    const[data,setData]= useState(null);
    const[sites,setSites] = useState([]);
    const[isValid, setIsValid] = useState(false);

    //Load blocked sites from storage
    useEffect(() => {
        chrome.storage.local.get(['blockedSites'], (result) => {
            if(result.blockedSites) {
                setSites(result.blockedSites);
            }
        });
    }, []);

    //Sync to storage and background whenever sites change
    useEffect(() => {
        chrome.storage.local.set({ blockedSites: sites });
        chrome.runtime.sendMessage({ type: "updateSites", sites });
    }, [sites]);

    //Use regex url pattern to check if user input is a website or not
    const isValidWebsite = (url) => {
        
        const pattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
        return pattern.test(url.trim())
    }

    //Add a site to the list of blocked sites
    const add = () =>{
        // Check if the input is a valid website
        if (!isValidWebsite(data)){
            alert("Please return a valid website")
            return
        }
        const updatedSites = [...sites, data];
        // Check for duplicates
        if (sites.includes(data)) {
            alert("This site is already blocked");
            return;
        }

        setSites([...sites,data])
        setData("")
    }

    //Remove a site from the list of blocked sites
    const remove = (siteToRemove) =>{
        const updatedSites = sites.filter(site => site !== siteToRemove);
        setSites(sites.filter(site => site !== siteToRemove))

    }

    //Input change
    const getData = (val) =>{
        const value = val.target.value;
        setData(value);
        setIsValid(isValidWebsite(value));
    }

    return(
    <div className = "App">
    <h1>Site Blocker</h1>
    <p>Copy and paste a website you wish to block</p>
    
    <input type = "text" onChange={getData}/>
    <p>{isValid ? "Valid URL" : "Invalid URL"}</p>
    <button onClick = {add}>Click to add</button>
    <h2>Blocked Sites</h2>
    <ul>
        {sites.map((site) => (
            <li key = {site}>{site} <button onClick={() => remove(site)}>Remove</button></li>
        ))}
    </ul>
    </div>

    );
    
}

