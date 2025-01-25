import { json } from '@sveltejs/kit';

const API_KEY = '9fd5d667f75523d43f1799e8'; // Your valid API key

export async function GET({ url }) {
    const baseCurrency = url.searchParams.get('base') || 'USD';
    const apiUrl = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`;

    console.log('Fetching rates from:', apiUrl);

    try {
        const response = await fetch(apiUrl);

        console.log('API Response Status:', response.status);

        if (!response.ok) {
            throw new Error(`Failed to fetch rates for base currency: ${baseCurrency}`);
        }

        const data = await response.json();

        console.log('API Response Data:', data);

        if (data.result !== 'success') {
            throw new Error(`API error: ${data['error-type']}`);
        }

        return json({
            success: true,
            base: baseCurrency,
            rates: data.conversion_rates
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching rates:', error.message);
        } else {
            console.error('Error fetching rates:', error);
        }
        return json(
            {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
