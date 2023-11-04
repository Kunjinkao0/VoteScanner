@file:JvmName("Utils")

package f.z.nfcscan

import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.concurrent.TimeUnit

const val TAG_OKHTTP = "OKHTTP"

val okClient = OkHttpClient.Builder()
    .connectTimeout(5, TimeUnit.SECONDS)
    .build()


var API_HOST = ""
    set(value) {
        field = "http://${value}:4399/api"
    }

val MEDIA_TYPE_JSON = "application/json; charset=utf-8".toMediaType()
fun toJsonBody(jsonData: JSONObject): RequestBody {
    return jsonData.toString().toRequestBody(MEDIA_TYPE_JSON)
}

fun bytesToHexString(src: ByteArray?): String {
    val stringBuilder = StringBuilder("0x")
    if (src == null || src.isEmpty()) {
        return "null"
    }
    val buffer = CharArray(2)
    for (i in src.indices) {
        buffer[0] = Character.forDigit(src[i].toInt() ushr 4 and 0x0F, 16)
        buffer[1] = Character.forDigit(src[i].toInt() and 0x0F, 16)
        println(buffer)
        stringBuilder.append(buffer)
    }
    return stringBuilder.toString()
}