const create = async (params, credentials, course) => {
    try {
        let response = await fetch(`/api/courses/by/${params.userId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${credentials.t}`
            },
            body: course
        })

        return response.json()
    } catch (error) {
        console.log(error)
    }
}

const listByInstructor = async (params, credentials, signal) => {
    try {
        let response = await fetch(`/api/courses/by/${params.userId}`, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${credentials.t}`
            },
        })

        return response.json()
    } catch (error) {
        console.log(error)
    }
}

const read = async (params, signal) => {
    try {
        let response = await fetch(`/api/courses/${params.courseId}`, {
            method: 'GET',
            signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        const res = await response.json()
        console.log({res})
        return res
    } catch (error) {
        console.log(error)
    }
}

const newLesson = async (params, credentials, lesson) => {
    try {
        let response = await fetch(`/api/courses/${params.courseId}/lesson/new`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.t}`
            },
            body: JSON.stringify({lesson: lesson})
        })

        return response.json()
    } catch (error) {
        console.log(error)
    }
}

const update = async (params, credentials, course) => {
    try {
        let response = await fetch(`/api/courses/${params.courseId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${credentials.t}`
            },
            body: course
        })

        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

const remove = async (params, credentials) => {
    try {
        let response = await fetch(`/api/courses/${params.courseId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })

        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

export { create, listByInstructor, read, newLesson, remove, update }