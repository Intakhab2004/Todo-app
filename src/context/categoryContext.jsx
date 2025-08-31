import axios from "axios";
import { createContext, useState } from "react";
import { category } from "../services/apis";


export const CategoryContext = createContext();

export const CategoryProvider = ({children}) => {
    const [categories, setCategories] = useState([]);
    const [loader, setLoader] = useState(false);

    
    //Fetching category
    const getCategories = async() => {
        const token = JSON.parse(localStorage.getItem("token"));
        
        setLoader(true);
        try{
            const result = await axios.get(category.GET_CATEGORY, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(result.data.success){
                setCategories(result.data.userCategory || []);
            }
        }
        catch(error){
            if(error.response){
                console.log("Error response:", error.response.data);
            }
            else{
                console.log("An error occurred:", error.message);
            }     
        }
        finally{
            setLoader(false);
        }
    }

    return (
        <CategoryContext.Provider
            value={{categories, setCategories, getCategories, loader}}
        >
            {children}
        </CategoryContext.Provider>
    )
}