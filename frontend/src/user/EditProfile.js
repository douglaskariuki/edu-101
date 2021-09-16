import { Card, CardContent, Icon, TextField, Typography } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions'
import React, { useState, useEffect } from 'react'
import { Redirect } from "react-router-dom"
import auth from '../auth/auth-helper'
import { read, update } from './api-user'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'
import Avatar from '@material-ui/core/Avatar'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    card: {
      maxWidth: 600,
      margin: 'auto',
      textAlign: 'center',
      marginTop: theme.spacing(5),
      paddingBottom: theme.spacing(2)
    },
    title: {
      margin: theme.spacing(2),
      color: theme.palette.protectedTitle
    },
    error: {
      verticalAlign: 'middle'
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 300
    },
    submit: {
      margin: 'auto',
      marginBottom: theme.spacing(2)
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 'auto'
    }
}))


export default function EditProfile(props) {
    const classes = useStyles();
    const [values, setValues] = useState({
        name: '',
        password: '',
        email: '',
        id: '',
        open: false,
        error: '',
        redirectToProfile: false,
        educator: false
    })

    const userId = props.match.params.userId;
    const jwt = auth.isAuthenticated()

    useEffect(() => {
        const abortController = new AbortController() 
        console.log({abortController});

        const signal = abortController.signal

        read({userId}, {t: jwt.token}, signal).then((data) => {
            if(data && data.error) {
                setValues({ 
                    ...values, 
                    error: data.error 
                })

            } else {
                setValues({
                    ...values, 
                    name: data.name, 
                    email: data.email, 
                    educator: data.educator
                })
            }
        })

        return () => {
            abortController.abort()
        }
    }, [userId])

    const clickSubmit = () => {

        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined,
            educator: values.educator
        }

        update({
            userId
        }, {
            t: jwt.token
        }, user).then((data) => {
            if(data && data.error) {
                setValues({...values, error: data.error})
            } else {
                auth.updateUser(data, () => {
                    setValues({ ...values, id: data.id, redirectToProfile: true })
                })
            }
        })

    }

    const handleCheck = (event, checked) => {
        setValues({...values, educator: checked})
    }

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }

    if(values.redirectToProfile) {
        return (
            <Redirect to={`/user/${values.id}`} />
        )
    }

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h6" className={classes.title}>
                    Edit Profile
                </Typography>

                <br />

                <input
                    accept="image/*" 
                    onChange={handleChange('photo')}
                    className={classes.input}
                    style={{display: 'none'}}  // hide input element from view
                    id="icon-button-file"
                    type="file"
                />

                <label htmlFor="icon-button-file">
                    <Button variant="contained" color="default" component="span">
                        Upload
                        <FileUpload />
                    </Button>
                </label>
                <span className={classes.filename}>{values.photo ? values.photo.name : ''}</span>
                
                <br/>

                <TextField 
                    id="name" 
                    label="Name"
                    className={classes.textField}
                    value={values.name}
                    onChange={handleChange("name")}
                    margin="normal"
                    margin="normal"
                />

                <br/>

                <TextField
                    id="email" 
                    label="Email"
                    type="email"
                    className={classes.textField}
                    value={values.email}
                    onChange={handleChange("email")}
                    margin="normal"
                />

                <br/>

                <TextField 
                    id="password" 
                    label="Password"
                    type="password"
                    className={classes.textField}
                    value={values.password}
                    onChange={handleChange("password")}
                    margin="normal"
                />

                <br />

                <Typography variant="subtitle1" className={classes.subheading}>
                    I am an Educator
                </Typography>
                <FormControlLabel
                    control={
                        <Switch classes={{
                                            checked: classes.checked,
                                            bar: classes.bar,
                                        }}
                                checked={values.educator}
                                onChange={handleCheck}
                        />
                    }
                    label={values.educator? 'Yes' : 'No'}
                />

                <br />
                
                {
                    values.error && (
                        <Typography component="p" color="error">
                            <Icon color="error" className={classes.error}>
                                error
                            </Icon>
                            {values.error}
                        </Typography>
                    )
                }
            </CardContent>

            <CardActions>
                <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
            </CardActions>
        </Card>            

    )
}