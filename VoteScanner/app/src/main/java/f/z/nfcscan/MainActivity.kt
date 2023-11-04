package f.z.nfcscan

import android.app.PendingIntent
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.media.MediaPlayer
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.widget.TextView
import androidx.appcompat.app.ActionBar
import androidx.appcompat.app.AppCompatActivity
import androidx.preference.PreferenceManager
import okhttp3.Call
import okhttp3.Callback
import okhttp3.Request
import okhttp3.Response
import org.json.JSONObject
import java.io.IOException

class MainActivity : AppCompatActivity() {

    companion object {
        const val MODE_NFC_TEST = "0"
        const val MODE_DEVICE_REGISTER = "1"
        const val MODE_VOTE_READER = "2"
    }

    private var nfcPendingIntent: PendingIntent? = null
    private var nfcAdapter: NfcAdapter? = null

    private lateinit var tagInfoTextView: TextView

    private var readerMode = MODE_VOTE_READER;

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tagInfoTextView = findViewById(R.id.result)

        if (!packageManager.hasSystemFeature(PackageManager.FEATURE_NFC)) {
            updateTextView("Current device doesn't support NFC.")
            return
        }

        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
        if (nfcAdapter?.isEnabled == false) {
            updateTextView("NFC is not enabled on your device, please turn on the NFC first.")
            return
        }

        nfcPendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, javaClass).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
            PendingIntent.FLAG_MUTABLE
        )
    }

    override fun onResume() {
        super.onResume()
        checkHostFromPref()
        toggleNfc(true)
    }

    private fun checkHostFromPref() {
        val sharedPreferences: SharedPreferences =
            PreferenceManager.getDefaultSharedPreferences(this)
        API_HOST = sharedPreferences.getString("api_host", getString(R.string.default_host))!!
        val mode = sharedPreferences.getString("read_mode", "2")!!
        if (!mode.equals(readerMode)) {
            updateTextView(getString(R.string.default_read_text))
            readerMode = mode;
        }
        val optionValues = resources.getStringArray(R.array.option_values)
        val selectedIndex = optionValues.indexOf(readerMode)
        val optionLabels = resources.getStringArray(R.array.option_labels)
        findViewById<TextView>(R.id.mode).text = optionLabels[selectedIndex]
    }

    override fun onPause() {
        super.onPause()
        toggleNfc(false)
    }

    private fun toggleNfc(on: Boolean) {
        if (on) {
            nfcAdapter?.enableForegroundDispatch(this, nfcPendingIntent, null, null)
        } else {
            nfcAdapter?.disableForegroundDispatch(this)
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_settings -> {
                startActivity(Intent(this, SettingsActivity::class.java))
                true
            }
//            R.id.action_control -> {
//                startActivity(Intent(this, ControllerActivity::class.java))
//                true
//            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        if (NfcAdapter.ACTION_TAG_DISCOVERED == intent.action) {
            val tag = intent.getParcelableExtra<Tag>(NfcAdapter.EXTRA_TAG)
            val deviceId = bytesToHexString(tag?.id)

            if (readerMode == MODE_NFC_TEST) {
                updateTextView("DeviceId: ${deviceId}")
            } else if (readerMode == MODE_DEVICE_REGISTER) {
                deviceRegSubmit(deviceId)
            } else if (readerMode == MODE_VOTE_READER) {
                voteSubmit(deviceId)
            }
        }
    }

    private fun updateTextView(result: String, success: Int = 0) {
        runOnUiThread {
            tagInfoTextView.text = result
            if (success > 0) {
                tagInfoTextView.setTextColor(getColor(R.color.success))
            } else if (success < 0) {
                tagInfoTextView.setTextColor(getColor(R.color.failure))
            } else {
                tagInfoTextView.setTextColor(Color.WHITE)
            }
        }
    }

    private fun playSoundEffect(audioResourceId: Int) {
        val mediaPlayer = MediaPlayer.create(this, audioResourceId)
        mediaPlayer.start()
        mediaPlayer.setOnCompletionListener { mediaPlayer.release() }
    }

    private fun voteSubmit(deviceId: String) {
        updateTextView("Submitting...")
        val url = "${API_HOST}/vote/submit"
        val jsonData = JSONObject()
        jsonData.put("deviceId", deviceId)
        val request = Request.Builder().url(url).post(toJsonBody(jsonData)).build()

        okClient.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e(TAG_OKHTTP, e.toString())
                playSoundEffect(R.raw.failure)
                updateTextView(e.toString(), -1)
            }

            override fun onResponse(call: Call, response: Response) {
                val data = response.body!!.string()
                if (response.isSuccessful) {
                    Log.v(TAG_OKHTTP, data)
                    val jsonObject = JSONObject(data)
                    val total = jsonObject.getString("total")
                    updateTextView("Total: $total", 1)
                    playSoundEffect(R.raw.success)
                } else {
                    Log.e(TAG_OKHTTP, "ERROR in ${url}: ${response.message}")
                    Log.e(TAG_OKHTTP, data)

                    updateTextView(data, -1)
                    playSoundEffect(R.raw.failure)
                }
            }
        })
    }

    private fun deviceRegSubmit(deviceId: String) {
        updateTextView("Submitting...")
        val url = "${API_HOST}/devices"
        val jsonData = JSONObject()
        jsonData.put("deviceId", deviceId)
        val request = Request.Builder().url(url).put(toJsonBody(jsonData)).build()

        okClient.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e(TAG_OKHTTP, e.toString())
                playSoundEffect(R.raw.failure)
                updateTextView(e.toString(), -1)
            }

            override fun onResponse(call: Call, response: Response) {
                val data = response.body!!.string()
                if (response.isSuccessful) {
                    Log.v(TAG_OKHTTP, data)
                    updateTextView("Registered", 1)
                    playSoundEffect(R.raw.success)
                } else {
                    Log.e(TAG_OKHTTP, "ERROR in ${url}: ${response.message}")
                    Log.e(TAG_OKHTTP, data)
                    updateTextView(data, -1)
                    playSoundEffect(R.raw.failure)
                }
            }
        })
    }
}