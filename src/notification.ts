/**
 * @file render notification
 * @author netcon
 */

import './notification.css';

const NOTIFICATION_STORAGE_KEY = 'GITHUB1S_NOTIFICATION';
// Change this if a new notification should be shown
const NOTIFICATION_STORAGE_VALUE = '20210212';

/*** begin notificaton block ***/
export const renderNotification = (platform: string) => {
	// If user has confirmed the notification and checked `don't show me again`, ignore it
	if (window.localStorage.getItem(NOTIFICATION_STORAGE_KEY) === NOTIFICATION_STORAGE_VALUE) {
		return;
	}
};
