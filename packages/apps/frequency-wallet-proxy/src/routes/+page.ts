import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { StatusCodes } from 'http-status-codes';

export const load: PageLoad = () => {
  redirect(StatusCodes.PERMANENT_REDIRECT, '/signin');
};
