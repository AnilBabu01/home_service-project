import { COLORS, SIZES, icons, illustrations } from '../../constants'
import { StyleSheet } from 'react-native'
export const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 16,
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    reviewHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    reviewHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        width: 16,
        height: 16,
    },
    starTitle: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.black2,
    },
    seeAll: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
    },
    // Styles for rating buttons
    ratingButtonContainer: {
        paddingVertical: 10,
        marginVertical: 12,
    },
    ratingButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.4,
        borderColor: COLORS.primary,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedRatingButton: {
        backgroundColor: COLORS.primary,
    },
    ratingButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        marginLeft: 10,
    },
    selectedRatingButtonText: {
        color: COLORS.white,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginVertical: 12,
    },
    modalSubtitle: {
        fontSize: 16,
        fontFamily: 'regular',
        color: COLORS.black,
        textAlign: 'center',
        marginVertical: 12,
        marginHorizontal: 16,
    },
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalSubContainer: {
        height: '100%',
        width: SIZES.width,
        // backgroundColor: COLORS.white,
        // borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    backgroundIllustration: {
        height: 150,
        width: 150,
        marginVertical: 22,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -999,
    },
    modalIllustration: {
        height: 150,
        width: 150,
    },
    modalInput: {
        width: '100%',
        height: 52,
        backgroundColor: COLORS.tansparentPrimary,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderColor: COLORS.primary,
        borderWidth: 1,
        marginVertical: 12,
    },
    editPencilIcon: {
        width: 42,
        height: 42,
        tintColor: COLORS.white,
        zIndex: 99999,
        position: 'absolute',
        top: 54,
        left: 60,
    },
})
