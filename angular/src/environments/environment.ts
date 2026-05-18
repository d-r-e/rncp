const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback/42`);

export const environment = {
	production: true,
	auth_url:
		`https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-7282b484449a021720b0c6dbd86b212e0d9cd7980348786659e3ebf8f81cf718&redirect_uri=${redirectUri}&response_type=code`,
	api_url: 'https://api.intra.42.fr',
};
