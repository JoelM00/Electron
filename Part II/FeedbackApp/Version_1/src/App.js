import {v4 as uuidv4} from 'uuid'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { useState } from "react"
import Header from "./components/Header"
import FeedbackList from "./components/FeedbackList"
import FeedbackStats from "./components/FeedbackStats"
import FeedbackForm from "./components/FeedbackForm"
import AboutPage from './pages/AboutPage'
import AboutIconLink from './components/AboutIconLink'

import FeedbackData from "./data/FeedbackData"

function App() {
    const [feedback,setFeedback] = useState(FeedbackData)

    const deleteFeedback = (id) => {
        if (window.confirm('Are you sure you want to delete?'))
        setFeedback(feedback.filter((item) => item.id !== id))
    }

    const addFeedback = (newFeedback) => {
        newFeedback.id = uuidv4()
        setFeedback([newFeedback, ...feedback])//mantem todos os elementos existentes + o novo
    }

    return (
        <Router>
            <Header></Header>
            <div className="container"> 
                <Routes>
                    <Route exact path='/' element={
                    <>
                        <FeedbackForm handleAdd={addFeedback}/>
                        <FeedbackStats feedback={feedback}/>
                        <FeedbackList feedback={feedback} handleDelete={deleteFeedback}/>
                    </>}>
                    </Route>
                    <Route path='/about' element={<AboutPage/>}></Route>
                </Routes>
                <AboutIconLink></AboutIconLink>
            </div>
        </Router>
    )
}

export default App