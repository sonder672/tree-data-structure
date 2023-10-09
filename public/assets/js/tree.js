document.addEventListener('DOMContentLoaded', async function() {
    const successApiMessage = sessionStorage.getItem('successApiMessage');
    if (successApiMessage) {
        successAlert(successApiMessage);
        sessionStorage.removeItem('successApiMessage');
    }

    const loader = document.getElementById('loader');
	loader.classList.remove('d-none');
	loader.classList.add('d-flex');

	try {
        const treeAncestryContainer = document.getElementById('tree-ancestry-container');
        const treeDescendantContainer = document.getElementById('tree-descendant-container');

        const apiAncestryUrl = treeAncestryContainer.dataset.apiUrl;
        const apiDescendantUrl = treeDescendantContainer.dataset.apiUrl;

        const [treeAncestryData, treeDescendantData] = await Promise.all([
            consumeApi(apiAncestryUrl),
            consumeApi(apiDescendantUrl)
        ]);

        treeAncestryContainer.appendChild(createAncestryList(treeAncestryData.ancestry));
        createDescendantList(treeDescendantContainer, [treeDescendantData.descendants]);
    } catch(error)
    {
        console.log({error});
		errorAlert('Hubo un error inesperado. Agradecemos tu paciencia');
    } finally {
        loader.classList.remove('d-flex');
		loader.classList.add('d-none');
    }
});

document.getElementById('closeUpdateModal').addEventListener('click', () => {
    $('#updateModal').modal('hide');
});

const consumeApi = async (apiUrl, method = 'GET', alertTracking = false, body = null) => {
    const headers = {};

    if (body) {
        headers['Content-Type'] = 'application/json';
    }

    const requestOptions = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(apiUrl, requestOptions);
        
    const data = await response.json();

    if (!response.ok) {
        errorAlert(data.message);
            
        return null;
    }

    if (alertTracking) {
        sessionStorage.setItem('successApiMessage', data.message);
    }

    return data;
};

const errorAlert = (message) => {
	iziToast.error({
		title: 'Error',
		message,
		position: 'topRight',
		timeout: 5000
	});
}

const successAlert = (message) => {
	iziToast.success({
		title: 'Éxito',
		message,
		position: 'topRight',
		timeout: 5000
	});
}

const createAncestryList = (ancestryData) => {
    const ancestryList = document.createElement("ul");
    ancestryList.classList.add("ancestry-list");

    let currentParent = ancestryList;

    const reverseList = ancestryData.reverse();

    reverseList.forEach(async (node) => {
        const listItem = document.createElement("li");
        listItem.classList.add("row", "border", "border-primary", "p-2", "m-1", "bg-gray");

        const textDiv = document.createElement("div");
        textDiv.classList.add("col-8", "text-danger", "font-weight-bolder");
        textDiv.style.fontWeight = "bold";
        textDiv.textContent = `- Value: ${node.value}`;

        listItem.appendChild(textDiv);
        currentParent.appendChild(listItem);

        if (node.position >= 0) {
            // Si tiene una posición mayor que 0, es un nodo padre y se anida dentro del nodo anterior (padre).
            const nestedList = document.createElement("ul");
            listItem.appendChild(nestedList);
            currentParent = nestedList;
        }
    });

    return ancestryList;
};

const createDescendantList = (parentElement, data) => {
    const ul = document.createElement("ul");
  
    data.forEach(async (node) => {
        const li = document.createElement("li");
        li.classList.add("row", "border", "border-primary", "p-2", "m-1", "bg-gray");

        const textDiv = document.createElement("div");
        textDiv.classList.add("col-8", "text-danger", "font-weight-bolder");
        textDiv.style.fontWeight = "bold";
        textDiv.textContent = `- Value: ${node.value}`;

        const updateButton = await updateNode(node.nodeId);
        const deleteButton = await deleteNode(node.nodeId);

        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("col-4");
        buttonDiv.appendChild(deleteButton);
        buttonDiv.appendChild(updateButton);

        li.appendChild(textDiv);
        li.appendChild(buttonDiv);
        ul.appendChild(li);

        if (node.children && node.children.length > 0) {
        createDescendantList(li, node.children);
        }
    });
  
    parentElement.appendChild(ul);
};

const updateNode = async (nodeId) => {
    const updateButton = document.createElement("a");
    updateButton.href = '#';
    updateButton.classList.add("btn", "btn-primary", "btn-sm", "btn-right", "m-2");

    const updateIcon = document.createElement("i");
    updateIcon.classList.add("fas", "fa-pencil-alt");
    updateButton.appendChild(updateIcon);

    updateButton.addEventListener("click", () => {
        $('#updateModal').modal('show');
        document.getElementById('nodeToUpdateId').value = nodeId;

        document.getElementById('updateSubmit').removeEventListener('click', updateSubmitHandler);

        document.getElementById('updateSubmit').addEventListener('click', updateSubmitHandler);
    });

    return updateButton;
};  

const updateSubmitHandler = async () => {
    const newParentNodeValue = document.getElementById('newParentNodeValue').value;
    const nodeToUpdateId = document.getElementById('nodeToUpdateId').value;

    const data = {
        newParentNodeValue,
        nodeToUpdateId
    };

    const loader = document.getElementById('loader');
	loader.classList.remove('d-none');
	loader.classList.add('d-flex');

    try {
        const response = await consumeApi('/api/tree/update', 'POST', true, data);

        if (response) {
            window.location.reload();
        }
    } catch(error) {
        console.log({error});
		errorAlert('Hubo un error inesperado. Agradecemos tu paciencia');
    } finally {
        loader.classList.remove('d-flex');
		loader.classList.add('d-none');

        $('#updateModal').modal('hide');
    }
};

const deleteNode = async (nodeId) => {
    const deleteButton = document.createElement("a");
    deleteButton.href = '#';
    deleteButton.classList.add("btn", "btn-danger", "btn-sm", "btn-right");

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash");
    deleteButton.appendChild(deleteIcon);

    deleteButton.addEventListener("click", async () => {
        const response = await consumeApi(`api/tree/delete?nodeId=${nodeId}`, 'DELETE', true);

        if (response) {
            window.location.reload();
        }
    });

    return deleteButton;
};