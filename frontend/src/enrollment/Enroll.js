import React, {useState} from 'react';
import { create } from "./api-enrollment.js";
import {makeStyles} from '@material-ui/core/styles'
import auth from './../auth/auth-helper';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    form: {
        minWidth: 500
    }
}))

export default function Enroll(props) {
    const classes = useStyles()
    const [values, setValues] = useState({
        enrollmentId: '',
        error: '',
        redirect: false
    })

    const clickEnroll = () => {
        const jwt = auth.isAuthenticated()
        create({
            courseId: props.courseId
        }, {
            t: jwt.token
        }).then((data) => {
            if (data && data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({
                    ...values,
                    enrollmentId: data._id,
                    redirect: true
                })
            }
        })
    }

    if (values.redirect) {
        return (<Redirect to={`/learn/${values.enrollmentId}`} />)
    }
    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={clickEnroll}
        >
            Enroll
        </Button>
    )
}

Enroll.propTypes = {
    courseId: PropTypes.string.isRequired
}