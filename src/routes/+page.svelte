<script lang="ts">
    import { onMount } from 'svelte';

    interface Rates {
        [key: string]: number; // Map of currency codes to exchange rates
    }

    let rates: Rates = {}; // Stores exchange rates
    let baseCurrency = 'USD'; // Default base currency
    let targetCurrency = 'EUR'; // Default target currency
    let amount = 1; // Amount to convert
    let convertedAmount = 0; // Converted amount
    let errorMessage = ''; // Holds any error message from the API

    // Fetch rates for the selected base currency
    async function fetchRates() {
        errorMessage = ''; // Clear previous errors
        try {
            const response = await fetch(`/api/rates?base=${baseCurrency}`);
            const data = await response.json();

            if (data.success) {
                rates = data.rates; // Update rates with the API response
                convert(); // Recalculate conversion
            } else {
                throw new Error(data.error || 'Failed to fetch rates');
            }
        } catch (error) {
            console.error('Error fetching rates:', error);
            errorMessage = (error as Error).message; // Display error message to the user
        }
    }

    // Convert the input amount based on the selected target currency
    function convert() {
        if (rates[targetCurrency]) {
            convertedAmount = amount * rates[targetCurrency];
        } else {
            convertedAmount = 0; // Reset if the target currency isn't valid
        }
    }

    onMount(fetchRates); // Fetch rates when the component mounts
</script>

<style>
    main {
        max-width: 600px;
        margin: 2rem auto;
        font-family: Arial, sans-serif;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    select, input {
        margin: 0.5rem;
        padding: 0.5rem;
    }

    .error {
        color: red;
        font-weight: bold;
    }
</style>

<main>
    <h1>Currency Converter</h1>

    <label>
        Amount:
        <input type="number" bind:value={amount} on:input={convert} />
    </label>

    <label>
        From:
        <select bind:value={baseCurrency} on:change={fetchRates}>
            {#each Object.keys(rates) as currency}
                <option value={currency}>{currency}</option>
            {/each}
        </select>
    </label>

    <label>
        To:
        <select bind:value={targetCurrency} on:change={convert}>
            {#each Object.keys(rates) as currency}
                <option value={currency}>{currency}</option>
            {/each}
        </select>
    </label>

    {#if errorMessage}
        <p class="error">Error: {errorMessage}</p>
    {:else}
        <p>
            {amount} {baseCurrency} = {convertedAmount.toFixed(2)} {targetCurrency}
        </p>
    {/if}
</main>