import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Profile from './user/Profile';
import EditProfile from './user/EditProfile';
import PrivateRoute from './auth/PrivateRoute';
import Signin from './auth/Signin';
import Signup from './user/Signup';
import Home from './core/Home';
import Menu from './core/Menu';
import NewCourse from './course/NewCourse';
import ListByInstructor from './course/ListByInstructor';
import Course from './course/Course';
import EditCourse from './course/EditCourse';
import Enrollment from './enrollment/Enrollment';

const MainRouter = () => {
    return ( 
        <div>
            <Menu />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/signup" component={Signup}/>
                <Route path="/signin" component={Signin} />
                <Route path="/user/:userId" component={Profile} />
                <Route path="/course/:courseId" component={Course} />
                <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
                <PrivateRoute exact path="/teach/course/new" component={NewCourse} />
                <PrivateRoute path="/teach/course/edit/:courseId" component={EditCourse} />
                <PrivateRoute path="/teach/courses" component={ListByInstructor} />
                <PrivateRoute exact path="/teach/course/:courseId" component={Course}/>
                <PrivateRoute path="/learn/:enrollmentId" component={Enrollment}/>
            </Switch>
        </div>
    )
}

export default MainRouter