import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import Router from './router/Router'
import publicRoutes from './router/routes/publicRoutes'
import { getRoutes } from "./router/routes";
import { get_user_info } from "./store/Reducers/authReducer";
function App() {
  const dispatch = useDispatch()
  const { token } = useSelector(state => state.auth)
  const [allRoutes, setAllRoutes] = useState([...publicRoutes])

  useEffect(() => {
    const fetchData = async () => {
      let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGEzZjM1NTFiNzAxMGJlMzBhYjg3YiIsInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE3MTI4ODc2ODksImV4cCI6MTcxMzQ5MjQ4OX0.ww5VeFxypeRzwefqdC-iGcjVdaDk8Isvp_s1Y1JFrDg'
      try {
        const response = await fetch('http://localhost:5000/api/get-user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log(data, 'data11');
      } catch (error) {
        console.log(error, 'fine');
      }
    };
    fetchData();
  }, []);  

  useEffect(() => {
    const routes = getRoutes()
    setAllRoutes([...allRoutes, routes])
  }, [])
  useEffect(() => {
    if (token) {
      dispatch(get_user_info())
    }
  }, [token])
  return <Router allRoutes={allRoutes} />
}

export default App;
