import { showMessage } from 'react-native-flash-message'

export const showToast = (message, description, type) => {
    showMessage({
        message,
        description,
        type,
        position: 'top',
        icon: 'auto',
        duration: 1000,
    })
}
