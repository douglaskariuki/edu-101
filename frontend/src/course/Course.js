import React, {useState, useEffect}  from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Edit from '@material-ui/icons/Edit'
import {makeStyles} from '@material-ui/core/styles'
import auth from './../auth/auth-helper'
import { read } from './api-course.js'
import {Link} from "react-router-dom"
import NewLesson from './NewLesson'
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 800,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(12)
    }),
    flex:{
        display:'flex',
        marginBottom: 20
    },
    card: {
        padding:'24px 40px 40px'
    },
    subheading: {
        margin: '10px',
        color: theme.palette.openTitle
    },
    details: {
        margin: '16px',
    },
    sub: {
        display: 'block',
        margin: '3px 0px 5px 0px',
        fontSize: '0.9em'
    },
    media: {
        height: 190,
        display: 'inline-block',
        width: '100%',
        marginLeft: '16px'
    },
    icon: {
        verticalAlign: 'sub'
    },
    category:{
        color: '#5c5c5c',
        fontSize: '0.9em',
        padding: '3px 5px',
        backgroundColor: '#dbdbdb',
        borderRadius: '0.2em',
        marginTop: 5
    },
    action: {
        margin: '10px 0px',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    statSpan: {
        margin: '7px 10px 0 10px',
        alignItems: 'center',
        color: '#616161',
        display: 'inline-flex',
        '& svg': {
            marginRight: 10,
            color: '#b6ab9a'
        }
    },
    enroll:{
        float: 'right'
    }
}))

export default function Course(props) {
    const classes = useStyles();

    const [course, setCourse] = useState({ instructor: {} })
    const [values, setValues] = useState({
        error: ''
    })

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        
        read({courseId: props.match.params.courseId}, signal).then(data => {
            if(data.error) {
                console.log("error", data.error)
                setValues({...values, error: data.error})
            } else {
                console.log({data})
                setCourse(data)
            }
        })

        return () => {
            abortController.abort()
        }
    }, [props.match.params.courseId])

    const imageUrl = course._id 
        ? `/api/courses/photo/${course._id}?${new Date().getTime()}`
        : `/api/courses/defaultPhoto`

    const addLesson = (course) => {
        setCourse(course)
    }

    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <CardHeader
                    title={course.name}
                    subheader={
                        <div>
                            <Link to={`/user/${course.instructor._id}`} className={classes.sub}>By {course.instructor.name}</Link>
                            <span className={classes.category}>{course.category}</span>
                        </div>
                    }
                />

                {auth.isAuthenticated().user && auth.isAuthenticated().user._id == course.instructor._id && (
                    <span>
                        <Link to={`/teach/course/edit/${course._id}`}>
                            <IconButton aria-label="Edit" color="secondary">
                                <Edit />
                            </IconButton>
                        </Link>

                        {!course.published ? (
                            <>
                                <NewLesson courseId={course._id} addLesson={addLesson} />
                            </>
                        ) : null}
                    </span>
                )}

                <CardMedia 
                    image={imageUrl}
                    title={course.name}
                />

                <div>
                    <Typography variant="body1">
                        {course.description}
                    </Typography>
                </div>

                <CardHeader
                    title={
                        <Typography 
                            variant="h6" 
                            className={classes.subheading}
                        >
                            Lessons
                        </Typography>
                    }

                    subheader={
                        <Typography 
                            variant="body1" 
                            className={classes.subheading}
                        >
                            {course.lessons && course.lessons.length} lessons
                        </Typography>
                    }
                    
                    action={
                        auth.isAuthenticated().user 
                        && auth.isAuthenticated().user._id == course.instructor._id 
                        && !course.published && (
                            <span className={classes.action}>
                                <NewLesson 
                                    courseId={course._id} 
                                    addLesson={addLesson}
                                />
                            </span>
                        )
                    }
                />

                <List>
                    {course.lessons && course.lessons.map((lesson, index) => {
                        return (
                            <span key={index}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            {index+1}
                                        </Avatar>
                                    </ListItemAvatar>

                                    <ListItemText 
                                        primary={lesson.title} 
                                    />
                                </ListItem>

                                <Divider 
                                    variant="inset"
                                    component="li"
                                />
                            </span>
                        )
                    })}
                </List>

            </Card>
        </div>
    )
}
