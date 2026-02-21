export const convertDateFormat = (inputDate) => {
    const dateObj = new Date(inputDate)

    const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    })

    return formattedDate
}

export const getLastWord = (text) => {
    const words = text.trim().split(' ')
    const lastWord = words[words.length - 1]

    return lastWord
}

export function formatDate(isoString) {
    const date = new Date(isoString)

    // Format options
    const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }

    // Convert to the desired format
    const formattedDate = date
        .toLocaleString('en-US', options)
        .replace(',', ' |')

    return formattedDate
}

export function formatDateHours(isoString) {
    const date = new Date(isoString)

    const options = {
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }
    return date.toLocaleString('en-US', options)
}

// export function formatTime(timestamp) {
//     const date = new Date(timestamp)

//     let hours = date.getHours()
//     let minutes = date.getMinutes()
//     const ampm = hours >= 12 ? 'PM' : 'AM'

//     hours = hours % 12 || 12
//     // Ensure minutes are two digits
//     minutes = minutes.toString().padStart(2, '0')

//     return `${hours}:${minutes} ${ampm}`
// }

export const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (totalRating / reviews.length).toFixed(1) // Round to 1 decimal place
}

export function formatTime(isoString) {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Enables AM/PM format
    })
}

export const checkIdExists = (data, idToCheck) => {
    return data?.some((item) => item?.user?.id === idToCheck)
}

export const countTotalClient = (data) => {
    const uniqueUserIds = new Set(data?.map((item) => item?.user?.id))

    return uniqueUserIds.size
}
