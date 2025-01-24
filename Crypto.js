document.addEventListener("DOMContentLoaded", function () {

    // Populate elements with saved data from the msot recent log entries

    function loadSavedMCapBTC() {
        const changeLog = JSON.parse(localStorage.getItem("mCapChangeLogBTC")) || [];
        if (changeLog.length > 0) {
            const lastEntry = changeLog[changeLog.length - 1];
            document.getElementById("mCapBTC").innerText = formatCurrency(lastEntry.cap);
            document.getElementById("mCapPercentChangeBTC").innerText = lastEntry.percentageChange.toFixed(2) + "%";
            document.getElementById("mCapPercentChangeBTC").style.color = lastEntry.percentageChange < 0 ? "red" : "green";
        } else {
            document.getElementById("mCapBTC").innerText = '';
            document.getElementById("mCapPercentChangeBTC").innerText = '';
        }
    }

    function loadSavedVolBTC() {
        const changeLog = JSON.parse(localStorage.getItem("volChangeLogBTC")) || [];
        if (changeLog.length > 0) {
            const lastEntry = changeLog[changeLog.length - 1];
            document.getElementById("volumeBTC").innerText = formatCurrency(lastEntry.volume);
            document.getElementById("volChangeBTC").innerText = lastEntry.percentageChange.toFixed(2) + "%";
            document.getElementById("volChangeBTC").style.color = lastEntry.percentageChange < 0 ? "red" : "green";
        } else {
            document.getElementById("volumeBTC").innerText = '';
            document.getElementById("volChangeBTC").innerText = '';
        }
    }

    // Event listeners for input fields that populate elements, enters log entries & log tables as well as performs % changes calulcations using the user's <input>

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

    function volumeChangeBTC(event) {
        if (event.key === "Enter") {
            event.preventDefault();

            let volBTC = parseFloat(document.getElementById("volumeInputBTC").value);
            const changeLog = JSON.parse(localStorage.getItem("volChangeLogBTC")) || [];
            const lastEntry = changeLog[changeLog.length - 1];

            if (isNaN(volBTC)) {
                alert("Please enter a valid number.");
                document.getElementById("volumeInputBTC").value = '';
                return;
            }

            document.getElementById("volumeBTC").innerText = formatCurrency(volBTC);
            document.getElementById("volumeInputBTC").value = '';

            let volPercentChange;
            if (lastEntry === undefined) {
                document.getElementById("volChangeBTC").innerText = "No prior data";
                volPercentChange = null; // Default value when there's no prior data
            } else {
                volPercentChange = ((volBTC - lastEntry.volume) / lastEntry.volume) * 100;
                document.getElementById("volChangeBTC").innerText = volPercentChange.toFixed(2) + "%";
                document.getElementById("volChangeBTC").style.color = volPercentChange < 0 ? "red" : "green";
            }

            logBTCVolChange(volBTC, volPercentChange);
        }
    }

    // Log's each individual user <input> into this log as a unique entry & then uodates the table that displays the log entries

    function logBTCmCapChange(cap, percentageChange) {
        const changeLog = JSON.parse(localStorage.getItem("mCapChangeLogBTC")) || [];
        const date = new Date().toLocaleDateString();
        changeLog.push({ date, cap, percentageChange });
        localStorage.setItem("mCapChangeLogBTC", JSON.stringify(changeLog));
        updateBTCMCapChangeLogTable();
    }

    function logBTCVolChange(volume, percentageChange) {
        const changeLog = JSON.parse(localStorage.getItem("volChangeLogBTC")) || [];
        const date = new Date().toLocaleDateString();
        changeLog.push({ date, volume, percentageChange });
        localStorage.setItem("volChangeLogBTC", JSON.stringify(changeLog));
        updateBTCVolChangeLogTable();
        console.log(changeLog);
    }

    // Updates the log display table whenever a new log entry is created

    function updateBTCMCapChangeLogTable() {
        const changeLog = JSON.parse(localStorage.getItem("mCapChangeLogBTC")) || [];
        const table = document.querySelector("#btcMCapSection .popupHide table");
        table.innerHTML = `
        <tr>
            <th>Date</th>
            <th>M Cap (% change)</th>
        </tr>
    `;
        changeLog.forEach((log, index) => {
            const percentageChange = log.percentageChange !== undefined ? log.percentageChange : "0.00";
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

    function updateBTCVolChangeLogTable() {
        const changeLog = JSON.parse(localStorage.getItem("volChangeLogBTC")) || [];
        const volTable = document.querySelector("#btcVolumeSection .popupHide table");
        volTable.innerHTML = `
        <tr>
            <th>Date</th>
            <th>Volume (% change)</th>
        </tr>
    `;
        changeLog.forEach((log, index) => {
            const percentageChange = log.percentageChange !== undefined ? log.percentageChange : "0.00";
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${log.date}</td>
            <td>${formatCurrency(log.volume)} (${percentageChange}%)</td>
            <td><button data-index="${index}" class="btc-vol-delete-log-button">Delete</button></td>
        `;
            volTable.appendChild(row);
        });

        const deleteButtons = document.querySelectorAll(".btc-vol-delete-log-button");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {
                const index = parseInt(button.getAttribute("data-index"));
                deleteBTCVolLogEntry(index);
            });
        });
    }

    // A button next to each individual log entry in the log display table that allows the user to delete that specific log entry

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

    function deleteBTCVolLogEntry(index) {
        const changeLog = JSON.parse(localStorage.getItem("volChangeLogBTC")) || [];
        changeLog.splice(index, 1);

        for (let i = index; i < changeLog.length; i++) {
            if (i === 0) {
                changeLog[i].percentageChange = undefined;
            } else {
                const prevVol = changeLog[i - 1].volume;
                const currentVol = changeLog[i].volume;
                changeLog[i].percentageChange = ((currentVol - prevVol) / prevVol) * 100;
            }
        }

        localStorage.setItem("volChangeLogBTC", JSON.stringify(changeLog));
        if (changeLog.length > 0) {
            const lastEntry = changeLog[changeLog.length - 1];
            document.getElementById("volumeBTC").innerText = formatCurrency(lastEntry.volume);
            document.getElementById("volChangeBTC").innerHTML = lastEntry.percentageChange !== undefined ? `(${lastEntry.percentageChange.toFixed(2)}%)` : '';
        } else {
            document.getElementById("volumeBTC").innerText = '';
            document.getElementById("volChangeBTC").innerText = '';
        }

        updateBTCVolChangeLogTable();
    }

    // Event listeners that display the log tables when the user mouses over certain sections of the page

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
    });

    document.getElementById("btcVolumeSection").addEventListener("mouseenter", function () {
        const popup = document.querySelector("#btcVolumeSection .popupHide");
        popup.classList.add("popupShow");
        popup.style.left = '50%';
        popup.style.top = '75%';
        updateBTCVolChangeLogTable(); // Ensure the table is updated on mouse enter
    });

    document.getElementById("btcVolumeSection").addEventListener("mouseleave", function () {
        const popup = document.querySelector("#btcVolumeSection .popupHide");
        popup.classList.remove("popupShow");
    });

    function formatCurrency(value) {
        return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    //updateBTCMCapChangeLogTable();
    document.getElementById("mCapInputBTC").addEventListener("keypress", mCapValueChangeBTC);
    document.getElementById("volumeInputBTC").addEventListener("keypress", volumeChangeBTC);
    //mCapValueChangeBTC();
    loadSavedMCapBTC();
    loadSavedVolBTC();
});