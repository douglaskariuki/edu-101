import { Card, Typography } from '@material-ui/core';
import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { listPublished } from '../course/api-course'
import Courses from '../course/Courses';
import auth from './../auth/auth-helper'

const useStyles = makeStyles(theme => ({
    card: {
        width: '90%',
        margin: 'auto',
        marginTop: 20,
        marginBottom: theme.spacing(2),
        padding: 20,
        backgroundColor: '#ffffff'
    },
    extraTop: {
        marginTop: theme.spacing(12)
    }
}))

export default function Home() {
    const classes = useStyles()
    const [courses, setCourses] = useState([]);
    const jwt = auth.isAuthenticated()

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        listPublished(signal).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                console.log("courses", data)
                setCourses(data)
            }
        })

        return () => {
            abortController.abort()
        } 
    }, [])

    return (
        <div className={classes.extraTop}>
            <Card className={classes.card}>
                <Typography variant="h5" component="h2">
                    All Courses
                </Typography>

                {(courses.length != 0
                    ? (
                        <Courses courses={courses} />
                    ) : (
                        <Typography variant="body1" className={classes.noTitle}>
                            No new courses.
                        </Typography>
                    )
                )}
            </Card>
        </div>
    )
}