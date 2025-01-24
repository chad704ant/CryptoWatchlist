document.addEventListener("DOMContentLoaded", function () {
    /*function loadSavedMCapBTC() {
        const changeLog = JSON.parse(localStorage.getItem("mCapChangeLogBTC")) || [];
        if (changeLog.length > 0) {
            const lastEntry = changeLog[changeLog.length - 1];
            document.getElementById("mCapBTC").innerText = formatCurrency(lastEntry.cap);
            updateMCapChangePercentBTC(lastEntry.percentageChange);
        } else {
            document.getElementById("mCapBTC").innerText = '';
            document.getElementById("mCapPercentChangeBTC").innerText = '';
        }
    }*/

    /*function mCapValueChangeBTC(event) {
        if (event.key === "Enter") {
            event.preventDefault();

            let mCapBTC = parseFloat(document.getElementById("mCapInputBTC").value);
            const changeLog = JSON.parse(localStorage.getItem("mCapChangeLogBTC")) || [];
            const lastEntry = changeLog[changeLog.length - 1];

            if (isNaN(mCapBTC)) {
                alert("Please enter a valid number.");
                document.getElementById("mCapInputBTC").value = '';
                return;
            }
                document.getElementById("mCapBTC").innerText = formatCurrency(mCapBTC);
                document.getElementById("mCapInputBTC").value = '';
            
            let mCapPercentChange;
            if (lastEntry === undefined) {
                document.getElementById("mCapPercentChangeBTC").innerText = "No prior data";
            } else {
                mCapPercentChange = ((mCapBTC - lastEntry.cap) / lastEntry.cap) * 100;
                document.getElementById("mCapPercentChangeBTC").innerText = mCapPercentChange.toFixed(2) + "%";
            }

            //const changeLog = JSON.parse(localStorage.getItem("mCapChangeLogBTC")) || [];
            //const lastEntry = changeLog[changeLog.length - 1];
            
            //updateMCapChangePercentBTC(mCapPercentChangeBTC);
            //logBTCmCapChange(mCapBTC, mCapPercentChangeBTC);
            //localStorage.setItem("mCapBTCItem", mCapBTC);
            //mCapPercentChangeBTC(mCapBTC)
            //logBTCmCapChange(mCapBTC, mCapPercentChange);
        }
    }*/

    function mCapValueChangeBTC(event) {
        if (event.key === "Enter") {
            event.preventDefault();

            let mCapBTC = parseFloat(document.getElementById("mCapInputBTC").value);
            const changeLog = JSON.parse(localStorage.getItem("mCapChangeLogBTC")) || [];
            const lastEntry = changeLog[changeLog.length - 1];

            if (isNaN(mCapBTC)) {
                alert("Please enter a valid number.");
                document.getElementById("mCapInputBTC").value = '';
                return;
            }

            document.getElementById("mCapBTC").innerText = formatCurrency(mCapBTC);
            document.getElementById("mCapInputBTC").value = '';

            let mCapPercentChange;
            if (lastEntry === undefined) {
                document.getElementById("mCapPercentChangeBTC").innerText = "No prior data";
                mCapPercentChange = null; // Default value when there's no prior data
            } else {
                mCapPercentChange = ((mCapBTC - lastEntry.cap) / lastEntry.cap) * 100;
                document.getElementById("mCapPercentChangeBTC").innerText = mCapPercentChange.toFixed(2) + "%";
                document.getElementById("mCapPercentChangeBTC").style.color = mCapPercentChange < 0 ? "red" : "green";
            }

            logBTCmCapChange(mCapBTC, mCapPercentChange);
        }
    }

    /*function mCapPercentChangeBTC(currentCap) {
        const changeLog = JSON.parse(localStorage.getItem("mCapChangeLogBTC")) || [];
        const lastEntry = changeLog[changeLog.length - 1];

        if (lastEntry === undefined) {
            document.getElementById("mCapPercentChangeBTC").innerText = "No prior data";
        } else {
            let mCapPercentChange = ((currentCap - lastEntry.cap) / lastEntry.cap) * 100;
            document.getElementById("mCapPercentChangeBTC").innerText = mCapPercentChange.toFixed(2) + "%";
        }

    }*/

    /*function updateMCapChangePercentBTC(percentageChangeMCapBTC) {
        document.getElementById("mCapPercentChangeBTC").innerText = `(${percentageChangeMCapBTC.toFixed(2)}%)`;
        document.getElementById("mCapPercentChangeBTC").style.color = percentageChangeMCapBTC < 0 ? "red" : "green";
    }*/

    function logBTCmCapChange(cap, percentageChange) {
        const changeLog = JSON.parse(localStorage.getItem("mCapChangeLogBTC")) || [];
        const date = new Date().toLocaleDateString();
        changeLog.push({ date, cap, percentageChange });
        localStorage.setItem("mCapChangeLogBTC", JSON.stringify(changeLog));
        //updateBTCMCapChangeLogTable();
        console.log(changeLog);
    }

    /*function updateBTCMCapChangeLogTable() {
        const changeLog = JSON.parse(localStorage.getItem("mCapChangeLogBTC")) || [];
        const table = document.querySelector("#btcMCapSection .popupHide table");
        table.innerHTML = `
        <tr>
            <th>Date</th>
            <th>M Cap (% change)</th>
        </tr>
    `;
        changeLog.forEach((log, index) => {
            const percentageChange = log.percentageChange !== undefined ? log.percentageChange.toFixed(2) : "0.00";
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${log.date}</td>
            <td>${formatCurrency(log.cap)} (${percentageChange}%)</td>
            <td><button data-index="${index}" class="btc-mcap-delete-log-button">Delete</button></td>
        `;
            table.appendChild(row);
        });

        const deleteButtons = document.querySelectorAll(".btc-mcap-delete-log-button");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {
                const index = parseInt(button.getAttribute("data-index"));
                deleteBTCMCapLogEntry(index);
            });
        });
    }



    function deleteBTCMCapLogEntry(index) {
        const changeLog = JSON.parse(localStorage.getItem("mCapChangeLogBTC")) || [];
        changeLog.splice(index, 1);

        for (let i = index; i < changeLog.length; i++) {
            if (i === 0) {
                changeLog[i].percentageChange = undefined;
            } else {
                const prevCap = changeLog[i - 1].cap;
                const currentCap = changeLog[i].cap;
                changeLog[i].percentageChange = ((currentCap - prevCap) / prevCap) * 100;
            }
        }

        localStorage.setItem("mCapChangeLogBTC", JSON.stringify(changeLog));
        if (changeLog.length > 0) {
            const lastEntry = changeLog[changeLog.length - 1];
            document.getElementById("mCapBTC").innerText = formatCurrency(lastEntry.cap);
            document.getElementById("mCapPercentChangeBTC").innerHTML = lastEntry.percentageChange !== undefined ? `(${lastEntry.percentageChange.toFixed(2)}%)` : '';
        } else {
            document.getElementById("mCapBTC").innerText = '';
            document.getElementById("mCapPercentChangeBTC").innerText = '';
        }

        updateBTCMCapChangeLogTable();
    }

    document.getElementById("btcMCapSection").addEventListener("mouseenter", function () {
        const popup = document.querySelector("#btcMCapSection .popupHide");
        popup.classList.add("popupShow");
        popup.style.left = '30%';
        popup.style.top = '75%';
        updateBTCMCapChangeLogTable(); // Ensure the table is updated on mouse enter
    });

    document.getElementById("btcMCapSection").addEventListener("mouseleave", function () {
        const popup = document.querySelector("#btcMCapSection .popupHide");
        popup.classList.remove("popupShow");
    });*/

    function formatCurrency(value) {
        return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    /*document.getElementById("mCapInputBTC").addEventListener("keypress", mCapValueChangeBTC);
    loadSavedMCapBTC();
    updateBTCMCapChangeLogTable();*/
    document.getElementById("mCapInputBTC").addEventListener("keypress", mCapValueChangeBTC);
    //mCapValueChangeBTC();
});