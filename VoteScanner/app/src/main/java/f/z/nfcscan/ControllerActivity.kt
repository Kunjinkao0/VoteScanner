package f.z.nfcscan

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import okhttp3.Call
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.IOException

class ControllerActivity : AppCompatActivity() {

    private lateinit var startBtn: Button;
    private lateinit var nextBtn: Button;
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_controller)

        startBtn = findViewById<Button>(R.id.start)
        startBtn.setOnClickListener {
            startVote()
        }
        nextBtn = findViewById<Button>(R.id.next)
        nextBtn.setOnClickListener {
            nextVote()
        }
    }

    fun startVote() {
        val url = "$API_HOST/vote/start";
        val client = OkHttpClient();
        val request = Request.Builder().url(url).build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e("TTT", e.toString())
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    val data = response.body?.string()
                    Log.v("TTT", "" + data)
                } else {
                    // Handle the error
                    Log.e("TTT", "e.toString()")
                }
            }
        })
    }

    fun nextVote() {
        val url = "$API_HOST/vote/next";
        val client = OkHttpClient();
        val request = Request.Builder().url(url).build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e("TTT", e.toString())
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    val data = response.body?.string()
                    Log.v("TTT", "" + data)
                } else {
                    // Handle the error
                    Log.e("TTT", "e.toString()")
                }
            }
        })
    }
}