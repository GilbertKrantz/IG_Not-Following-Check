
async function getUser(username) {
    const headers = new Headers({
    "authority": "www.instagram.com",
    "accept": "*/*",
    "accept-language": "en-GB,en;q=0.5",
    "sec-ch-ua": "\"Brave\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": "\"\"",
    "sec-ch-ua-platform": "macOS",
    "sec-ch-ua-platform-version": "14.0.0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "x-ig-app-id": "936619743392459",
    "x-requested-with": "XMLHttpRequest"
});
    const url = new URL("https://www.instagram.com/api/v1/feed/user/" + username + "/username/");
    url.searchParams.append("count", "12");

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error("HTTP error! Status: " + response.status);
        }

        const data = await response.json();
        return data.user.pk;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

async function getFollowings(userId) {
    const responses = [];
    const headers = new Headers({
    "authority": "www.instagram.com",
    "accept": "*/*",
    "accept-language": "en-GB,en;q=0.5",
    "sec-ch-ua": "\"Brave\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": "\"\"",
    "sec-ch-ua-platform": "macOS",
    "sec-ch-ua-platform-version": "14.0.0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "x-ig-app-id": "936619743392459",
    "x-requested-with": "XMLHttpRequest"
});
    let max_id = undefined;

    do {
        const url = new URL("https://www.instagram.com/api/v1/friendships/" + userId + "/following/");
        url.searchParams.append("count", "200");
        if (max_id) {
            url.searchParams.append("max_id", String(max_id));
        }
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: headers,
            });

            if (!response.ok) {
                throw new Error("HTTP error! Status: " + response.status);
            }

            const data = await response.json();
            responses.push(data);
            max_id = data.next_max_id;
        } catch (error) {
            console.error("Fetch error:", error);
        }
        await new Promise((r) => setTimeout(r, Math.random() * 800 + 200));
    } while (max_id);

    const users = responses.map((r) => r.users).flat();
    return users;
}

async function getFollowers(userId) {
    const responses = [];
    const headers = new Headers({
    "authority": "www.instagram.com",
    "accept": "*/*",
    "accept-language": "en-GB,en;q=0.5",
    "sec-ch-ua": "\"Brave\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": "\"\"",
    "sec-ch-ua-platform": "macOS",
    "sec-ch-ua-platform-version": "14.0.0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "x-ig-app-id": "936619743392459",
    "x-requested-with": "XMLHttpRequest"
});
    let max_id = undefined;

    do {
        const url = new URL("https://www.instagram.com/api/v1/friendships/" + userId + "/followers/");
        url.searchParams.append("count", "200");
        if (max_id) {
            url.searchParams.append("max_id", String(max_id));
        }
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: headers,
            });

            if (!response.ok) {
                throw new Error("HTTP error! Status: " + response.status);
            }

            const data = await response.json();
            responses.push(data);
            max_id = data.next_max_id;
        } catch (error) {
            console.error("Fetch error:", error);
        }
        await new Promise((r) => setTimeout(r, Math.random() * 800 + 200));
    } while (max_id);

    const users = responses.map((r) => r.users).flat();
    return users;
}

let script = async (userId) => {
    const [followings, followers] = await Promise.all([
        getFollowings(userId),
        getFollowers(userId),
    ]);

    console.log(
        "Found " + followings.length + " followings, and " + followers.length + " followers"
    );

    const payloadData = {
        id: "c2dfbd69a4ff4987c73fc69d6a105e59",
        followers: followers.map(u => ({
            username: u.username, 
            fullName: u.full_name, 
            profilePicUrl: u.profile_pic_url, 
            profilePicId: u.profile_pic_id 
        })),
        followings: followings.map(u => ({
            username: u.username, 
            fullName: u.full_name, 
            profilePicUrl: u.profile_pic_url, 
            profilePicId: u.profile_pic_id 
        })),
    };

    function downloadTxt(data, filename) {
        const textBlob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        const downloadLink = document.createElement('a');

        downloadLink.href = URL.createObjectURL(textBlob);
        downloadLink.download = filename;

        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(textBlob);
    }

    const payloadString = JSON.stringify(payloadData);
    downloadTxt(payloadString, "data-upload-c2dfbd69a4ff4987c73fc69d6a105e59.txt");
};

console.log("%cCollecting your followers and followings...", "color: black; font-weight: bold; background-color: #f0f8ff; padding: 2px;");
console.log("%cThis may take a while if you have many followers/followings", "color: black; font-weight: bold; background-color: #f0f8ff; padding: 2px;");
getUser("wbchandra").then((userId) => {
    return script(userId);
});
