import { useState } from "react"
import Card from "./shared/Card"
import Button from "./shared/Button"
import RatingSelect from "./RatingSelect";

function FeedbackForm({handleAdd}) {
    const [text,setText] = useState('')
    const [rating,setRating] = useState(10)
    const [btnDisable,setBtnDisable] = useState(true)
    const [message,setMessage] = useState('')
    const handleTextChange = (e) => {
        if (text === '') {
            setBtnDisable(true)
            setMessage(null)
        } else if (text !== '' && text.trim().length <= 10) {
            setBtnDisable(true)
            setMessage('Text must be at least 10 characters')
        } else {
            setMessage(null)
            setBtnDisable(false)
        }
        setText(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (text.trim().length > 10) {
            const newFeedback = {
                text: text,
                rating: rating,
            }
            handleAdd(newFeedback)
            setText('')
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <h2>How world you rate your service with us?</h2>
                <RatingSelect select={(rating) => setRating(rating)}></RatingSelect>
                <div className="input-group">
                    <input onChange={handleTextChange} type="text" placeholder="Write a review" value={text}/>
                    <Button type="submit" isDisabled={btnDisable}>Send</Button>
                </div>
                {message && <div className='message'>{message}</div>}
            </form>
        </Card>
    )
}

export default FeedbackForm